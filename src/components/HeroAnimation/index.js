import React from "react";
import PropTypes from "prop-types";
import CircularSlider from "react-circular-slider-svg";
import { useState, useEffect, memo } from "react";

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Sky } from "three/examples/jsm/objects/Sky.js";

// TODO: Remove if not needed
// import StarrySkyShader from "./starrySkyShader";
import Container from "components/ui/Container";

import * as Styled from "./styles";

const SLIDER_SIZE = 600;
const MAX_HOURS = 12;

class ThreeAnimation extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    let model, // Our character
      neck, // Reference to the neck bone in the skeleton
      waist, // Reference to the waist bone in the skeleton
      possibleAnims, // Animations found in our file
      mixer, // THREE.js animations mixer
      idle, // Idle, the default state our character returns to
      clock = new THREE.Clock(), // Used for anims, which run to a clock instead of frame rate
      currentlyAnimating = false, // Used to check whether characters neck is being used in another anim
      raycaster = new THREE.Raycaster(), // Used to detect the click on our character
      canvas;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.x = 2;
    this.camera.position.y = 2;
    this.camera.position.z = 30;
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.shadowMap.enabled = true;
    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.scene.background = new THREE.Color(0xefd1b5);
    this.scene.fog = new THREE.Fog(0xbfe3dd, 60, 10);

    // SKY & SUN
    this.sky = new Sky();
    this.sky.scale.setScalar(450000);
    this.scene.add(this.sky);

    this.sun = new THREE.Vector3();

    // Comments are original values
    this.skyEffectValues = {
      turbidity: 10, // 10
      rayleigh: Math.abs(this.props.sliderValue / MAX_HOURS) * 2 + 0.6, // 3
      mieCoefficient: 0.005, // 0.005
      mieDirectionalG: 0.7, // 0.7
      inclination: Math.abs(this.props.sliderValue / MAX_HOURS / 2), // 0.49
      azimuth: Math.abs(this.props.sliderValue / MAX_HOURS / 2), // 0.25
      exposure: this.renderer.toneMappingExposure, // this.renderer.toneMappingExposure
    };

    const uniforms = this.sky.material.uniforms;
    uniforms["turbidity"].value = this.skyEffectValues.turbidity;
    uniforms["rayleigh"].value = this.skyEffectValues.rayleigh;
    uniforms["mieCoefficient"].value = this.skyEffectValues.mieCoefficient;
    uniforms["mieDirectionalG"].value = this.skyEffectValues.mieDirectionalG;

    const theta = Math.PI * this.skyEffectValues.inclination - 0.5;
    const phi = 2 * Math.PI * this.skyEffectValues.azimuth - 0.5;

    this.sun.x = Math.cos(phi) * 0.5;
    this.sun.y = Math.cos(phi) * Math.cos(theta) * 0.15;
    this.sun.z = Math.sin(phi) * Math.cos(theta);

    uniforms["sunPosition"].value.copy(this.sun);

    this.renderer.toneMappingExposure = this.skyEffectValues.exposure;

    // END OF SKY

    // Append to DOM
    this.mount.appendChild(this.renderer.domElement);

    // Add lights
    let hemiLight = new THREE.HemisphereLight(0xfed8b1, 0xfed8b1, 0.3);
    hemiLight.position.set(0, 0, 0);
    // Add hemisphere light to this.scene
    this.scene.add(hemiLight);

    let d = 8.25;
    this.dirLightIntensity = Math.abs(this.props.sliderValue / MAX_HOURS) + 0.5;
    this.dirLight = new THREE.DirectionalLight(
      0xffffff,
      this.dirLightIntensity
    );
    this.dirLight.position.set(-3, 10, 2);
    this.dirLight.castShadow = false;
    this.dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
    this.dirLight.shadow.camera.near = 0.1;
    this.dirLight.shadow.camera.far = 1500;
    this.dirLight.shadow.camera.left = d * -1;
    this.dirLight.shadow.camera.right = d;
    this.dirLight.shadow.camera.top = d;
    this.dirLight.shadow.camera.bottom = d * -1;
    // Add directional Light to this.scene
    this.scene.add(this.dirLight);

    // Floor
    let floorGeometry = new THREE.PlaneBufferGeometry(400, 150, 1, 1);
    let floorMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x48bb78,
    });

    let floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -0.5 * Math.PI; // 90 deg rotation
    floor.receiveShadow = true;
    floor.position.y = -5;
    floor.position.z = 0;
    this.scene.add(floor);

    const resizeRendererToDisplaySize = (renderer) => {
      canvas = renderer.domElement;
      this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
      this.camera.updateProjectionMatrix();
      const pixelRatio = window.devicePixelRatio;
      let width = ((canvas.clientWidth / 3) * pixelRatio) | 0;
      //   let height = ((canvas.clientHeight / 3) * pixelRatio) | 0;
      let height = width;

      const needResize = canvas.width !== width || canvas.height !== height;
      if (needResize) {
        renderer.setSize(width, height, false);
      }
      return needResize;
    };

    const update = () => {
      if (mixer) {
        mixer.update(clock.getDelta());
      }
      if (resizeRendererToDisplaySize(this.renderer)) {
        canvas = this.renderer.domElement;
        this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
        this.camera.updateProjectionMatrix();
      }
      this.renderer.render(this.scene, this.camera);
      requestAnimationFrame(update);
    };

    update();

    // TODO: Make fake sun?
    let geometrySphere = new THREE.SphereGeometry(8, 32, 32);
    const sunLuminosity = Math.abs(this.props.sliderValue / MAX_HOURS);
    let materialSphere = new THREE.MeshStandardMaterial(
      { color: 0xf2ce2e,
        // fog: false, // affected by fog or not
        shadowSide: THREE.BackSide,
        emissive: '#F8CE3B',
        emissiveIntensity: sunLuminosity,
        // opacity: sunLuminosity,
        // transparent: true,
      }
    );
    this.fakeSun = new THREE.Mesh(geometrySphere, materialSphere);

    const fakeSunRadius = 12 / Math.PI;
    let fakeSunTheta = this.props.sliderValueTotal / fakeSunRadius;

    this.fakeSun.position.x = fakeSunRadius * Math.sin(fakeSunTheta) * 6;
    this.fakeSun.position.y = fakeSunRadius * Math.cos(fakeSunTheta) * 6;
    this.fakeSun.position.z = -80;
    this.fakeSun.scale.set(0.5, 0.5, 0.5);
    this.scene.add(this.fakeSun);

    // Moon
    const moonGeometrySphere = new THREE.SphereGeometry(8, 32, 32);
    const moonLuminosity = Math.abs(this.props.sliderValue /MAX_HOURS);
    const moonMaterialSphere = new THREE.MeshStandardMaterial(
      { 
        color: 0xf2ce2e,
        // fog: false, // affected by fog or not
        shadowSide: THREE.BackSide,
        emissive: '#fff',
        emissiveIntensity: moonLuminosity,
        opacity: moonLuminosity,
        transparent: true,
        flatShading: false,
      }
    );
    this.moon = new THREE.Mesh(moonGeometrySphere, moonMaterialSphere);

    const moonRadius = 12 / Math.PI;
    let moonTheta = this.props.sliderValueTotal / moonRadius;

    this.moon.position.x = -moonRadius * Math.sin(moonTheta) * 6;
    this.moon.position.y = -moonRadius * Math.cos(moonTheta) * 6;
    this.moon.position.z = -90;
    this.moon.scale.set(0.6, 0.6, 0.6);
    this.scene.add(this.moon);

    // const cloudGeometry = new THREE.SphereGeometry(10.3,  50, 50);
    // const cloudMaterial = new THREE.MeshPhongMaterial({
    //     // map: new THREE.ImageUtils.loadTexture("/images/clouds_2.jpg"),
    //     color: 0xffffff,
    //     transparent: true,
    //     opacity: 0.1
    // });

    // //Create a cloud mesh and add it to the scene.
    // const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
    // this.scene.add(clouds);

    const MODEL_PATH =
      "https://s3-us-west-2.amazonaws.com/s.cdpn.io/1376484/stacy_lightweight.glb";

    let stacy_txt = new THREE.TextureLoader().load(
      "https://s3-us-west-2.amazonaws.com/s.cdpn.io/1376484/stacy.jpg"
    );

    stacy_txt.flipY = false; // we flip the texture so that its the right way up

    const stacy_mtl = new THREE.MeshPhongMaterial({
      map: stacy_txt,
      color: 0xffffff,
      skinning: true,
    });

    var self = this;
    var loader = new GLTFLoader();
    loader.load(
      MODEL_PATH,
      function (gltf) {
        // A lot is going to happen here
        model = gltf.scene;
        let fileAnimations = gltf.animations;

        model.traverse((o) => {
          if (o.isMesh) {
            o.castShadow = true;
            o.receiveShadow = true;
            o.material = stacy_mtl;
          }

          // Reference the neck and waist bones
          if (o.isBone && o.name === "mixamorigNeck") {
            neck = o;
          }
          if (o.isBone && o.name === "mixamorigSpine") {
            waist = o;
          }
        });

        // Set the models initial scale
        model.scale.set(20, 20, 20);
        model.position.x = 2.5;
        model.position.y = -30;
        // model.position.z = 0;
        model.castShadow = true;

        // TODO: Uncomment when ready
        // Add model to this.scene
        // self.scene.add(model);

        // Remove loader
        self.loaderAnim.remove();

        mixer = new THREE.AnimationMixer(model);
        let idleAnim = THREE.AnimationClip.findByName(fileAnimations, "idle");
        idleAnim.tracks.splice(3, 3);
        idleAnim.tracks.splice(9, 3);
        idle = mixer.clipAction(idleAnim);
        idle.play();
      },
      undefined, // We don't need this function
      function (error) {
        console.error(error);
      }
    );

    document.addEventListener("mousemove", function (e) {
      var mousecoords = getMousePos(e);
      if (neck && waist) {
        moveJoint(mousecoords, neck, 50);
        moveJoint(mousecoords, waist, 30);
      }
    });

    function getMousePos(e) {
      return { x: e.clientX, y: e.clientY };
    }

    function moveJoint(mouse, joint, degreeLimit) {
      let degrees = getMouseDegrees(mouse.x, mouse.y, degreeLimit);
      joint.rotation.y = THREE.Math.degToRad(degrees.x);
      joint.rotation.x = THREE.Math.degToRad(degrees.y);
    }

    function getMouseDegrees(x, y, degreeLimit) {
      let dx = 0,
        dy = 0,
        xdiff,
        xPercentage,
        ydiff,
        yPercentage;

      let w = { x: window.innerWidth, y: window.innerHeight };

      // Left (Rotates neck left between 0 and -degreeLimit)

      // 1. If cursor is in the left half of screen
      if (x <= w.x / 2) {
        // 2. Get the difference between middle of screen and cursor position
        xdiff = w.x / 2 - x;
        // 3. Find the percentage of that difference (percentage toward edge of screen)
        xPercentage = (xdiff / (w.x / 2)) * 100;
        // 4. Convert that to a percentage of the maximum rotation we allow for the neck
        dx = ((degreeLimit * xPercentage) / 100) * -1;
      }
      // Right (Rotates neck right between 0 and degreeLimit)
      if (x >= w.x / 2) {
        xdiff = x - w.x / 2;
        xPercentage = (xdiff / (w.x / 2)) * 100;
        dx = (degreeLimit * xPercentage) / 100;
      }
      // Up (Rotates neck up between 0 and -degreeLimit)
      if (y <= w.y / 2) {
        ydiff = w.y / 2 - y;
        yPercentage = (ydiff / (w.y / 2)) * 100;
        // Note that I cut degreeLimit in half when she looks up
        dy = ((degreeLimit * 0.5 * yPercentage) / 100) * -1;
      }

      // Down (Rotates neck down between 0 and degreeLimit)
      if (y >= w.y / 2) {
        ydiff = y - w.y / 2;
        yPercentage = (ydiff / (w.y / 2)) * 100;
        dy = (degreeLimit * yPercentage) / 100;
      }
      return { x: dx, y: dy };
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.sliderValue !== this.props.sliderValue;
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.sliderValue !== this.props.sliderValue) {
      let rayleigh = Math.abs(nextProps.sliderValue / MAX_HOURS) * 3 + 0.6;
      let azimuth = Math.abs(nextProps.sliderValue / MAX_HOURS / 2);
      let inclination = Math.abs(nextProps.sliderValue / MAX_HOURS) / 2;
      let dirLightIntensity =
        -Math.abs(nextProps.sliderValue / MAX_HOURS) + 0.85;

      const theta = Math.PI * inclination - 0.5;
      const phi = 2 * Math.PI * azimuth - 0.5;

      const uniforms = this.sky.material.uniforms;
      uniforms["rayleigh"].value = rayleigh;

      let x = Math.cos(phi) * 0.5;
      let y = Math.cos(phi) * Math.cos(theta) * 0.15;
      let z = Math.sin(phi) * Math.cos(theta);

      this.sun.setX(x);
      this.sun.setY(y);
      this.sun.setZ(z);

      uniforms["sunPosition"].value.copy(this.sun);

      // Light
      this.dirLight.intensity = dirLightIntensity;

      // Update position of fake sun
      const fakeSunRadius = 12 / Math.PI;
      let fakeSunTheta = nextProps.sliderValueTotal / fakeSunRadius;

      const sunLuminosity = Math.abs(nextProps.sliderValue / MAX_HOURS);
      this.fakeSun.material.emissiveIntensity = sunLuminosity;

      this.fakeSun.position.x = fakeSunRadius * Math.sin(fakeSunTheta) * 6;
      this.fakeSun.position.y = fakeSunRadius * Math.cos(fakeSunTheta) * 6;

      // Update position of moon
      const moonLuminosity = Math.abs(nextProps.sliderValue / MAX_HOURS);
      this.moon.material.opacity = moonLuminosity;
      this.moon.material.emissiveIntensity = moonLuminosity;

      const moonRadius = 12 / Math.PI;
      let moonTheta = nextProps.sliderValueTotal / moonRadius;

      this.moon.position.x = -moonRadius * Math.sin(moonTheta) * 6;
      this.moon.position.y = -moonRadius * Math.cos(moonTheta) * 6;

      console.log("sliderValueTotal NEXT PROPS ", nextProps.sliderValueTotal);
    }
  }

  componentWillUnmount() {}

  render() {
    return (
      <div ref={(ref) => (this.mount = ref)}>
        {/* TODO: Add loading animation */}
        <Styled.LoaderAnim ref={(ref) => (this.loaderAnim = ref)}>
          <Styled.Loader>Loading...</Styled.Loader>
        </Styled.LoaderAnim>
      </div>
    );
  }
}

const HeroAnimation = memo(() => {
  const [time, setTime] = useState(new Date());
  const [sliderValue, setSliderValue] = useState(time.getHours() - MAX_HOURS);
  const [sliderValueTotal, setSliderValueTotal] = useState(
    time.getHours() - MAX_HOURS
  );
  const size = useWindowSize();

  console.log("sliderValueTotal CURRENT: ", sliderValueTotal);

  useEffect(() => {
    let timerID = setInterval(() => tick(), 1000 * 60);
    return function cleanup() {
      clearInterval(timerID);
    };
  }, []);

  function tick() {
    setTime(new Date());
  }

  const padding = 40;
  let width =
    size.width - padding >= SLIDER_SIZE ? SLIDER_SIZE : size.width - padding;
  let animationWidth =
    size.width >= SLIDER_SIZE * 2
      ? SLIDER_SIZE * 2 - padding
      : size.width - padding;

  return (
    <>
      <Container className="relative">
        <Styled.SliderWrapper sliderSize={width}>
          <Styled.Slider>
            <CircularSlider
              size={width}
              minValue={-MAX_HOURS}
              maxValue={MAX_HOURS}
              handle1={{
                value: sliderValue,
                onChange: (v) => {
                  setSliderValue(v);
                  const vTotal = v < 0 ? v + MAX_HOURS * 2 : v;
                  setSliderValueTotal(vTotal);
                },
              }}
              arcColor="#48bb78"
              arcBackgroundColor="#3c366b"
            />
          </Styled.Slider>
          <Styled.AnimationWrapper
            animationWidth={animationWidth}
            windowHeight={size.height}
          >
            <ThreeAnimation
              sliderValue={sliderValue}
              sliderValueTotal={sliderValueTotal}
            />
          </Styled.AnimationWrapper>
        </Styled.SliderWrapper>
      </Container>
    </>
  );
});

// HeroAnimation.propTypes = {};

const useWindowSize = () => {
  // Initialize state with undefined width so server and client renders match
  const [windowSize, setWindowSize] = useState({
    width: SLIDER_SIZE,
    height: SLIDER_SIZE,
  });

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount

  return windowSize;
};

export default HeroAnimation;
