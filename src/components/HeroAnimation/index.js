import React from "react";
import PropTypes from "prop-types";
import CircularSlider from "react-circular-slider-svg";
import { useState, useEffect } from "react";

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Sky } from "three/examples/jsm/objects/Sky.js";

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
    this.camera.position.z = 60;
    this.camera.position.x = 2;
    this.camera.position.y = 2;
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.shadowMap.enabled = true;
    this.renderer.setPixelRatio(window.devicePixelRatio);

    // this.scene.background = new THREE.Color(0xbfe3dd);
    this.scene.fog = new THREE.Fog(0xbfe3dd, 60, 100);

    // SKY & SUN
    this.sky = new Sky();
    this.sky.scale.setScalar(450000);
    this.scene.add(this.sky);

    this.sun = new THREE.Vector3();

    // skyEffectValues = {
    //     turbidity: 10,
    //     rayleigh: 3,
    //     mieCoefficient: 0.005,
    //     mieDirectionalG: 0.7,
    //     inclination: 0.49, // elevation / inclination
    //     azimuth: 0.25, // Facing front,
    //     exposure: this.renderer.toneMappingExposure
    // };
    this.skyEffectValues = {
      turbidity: 10,
      rayleigh: 3,
      mieCoefficient: 0.005,
      mieDirectionalG: 0.7,
      //   inclination: 0.49,
      inclination: Math.abs(this.props.sliderValue / MAX_HOURS), // elevation / inclination
      //   azimuth: 0.28, // Facing front, // NOTE: Can be used to darken sky
      azimuth: Math.abs(this.props.sliderValue / MAX_HOURS / 2),
      exposure: this.renderer.toneMappingExposure,
    };

    const uniforms = this.sky.material.uniforms;
    uniforms["turbidity"].value = this.skyEffectValues.turbidity;
    uniforms["rayleigh"].value = this.skyEffectValues.rayleigh;
    uniforms["mieCoefficient"].value = this.skyEffectValues.mieCoefficient;
    uniforms["mieDirectionalG"].value = this.skyEffectValues.mieDirectionalG;

    const theta = Math.PI * (this.skyEffectValues.inclination - 0.5);
    const phi = 2 * Math.PI * (this.skyEffectValues.azimuth - 0.5);

    this.sun.x = Math.cos(phi);
    this.sun.y = Math.sin(phi) * Math.sin(theta);
    this.sun.z = Math.sin(phi) * Math.cos(theta);

    console.log("ORIGINAL SUN ", this.sun, this.props.sliderValue);

    uniforms["sunPosition"].value.copy(this.sun);

    this.renderer.toneMappingExposure = this.skyEffectValues.exposure;
    // END OF SKY

    // Append to DOM
    this.mount.appendChild(this.renderer.domElement);

    // Add lights
    let hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.61);
    hemiLight.position.set(0, 50, 0);
    // Add hemisphere light to this.scene
    this.scene.add(hemiLight);

    // let d = 8.25;
    // let dirLight = new THREE.DirectionalLight(0xffffff, 0.04);
    // dirLight.position.set(-8, 18, 8);
    // dirLight.castShadow = true;
    // dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
    // dirLight.shadow.camera.near = 0.1;
    // dirLight.shadow.camera.far = 1500;
    // dirLight.shadow.camera.left = d * -1;
    // dirLight.shadow.camera.right = d;
    // dirLight.shadow.camera.top = d;
    // dirLight.shadow.camera.bottom = d * -1;
    // // Add directional Light to this.scene
    // this.scene.add(dirLight);

    // Floor
    // let floorGeometry = new THREE.PlaneGeometry(400, 150, 1, 1);
    // let floorMaterial = new THREE.MeshPhysicalMaterial({
    //   color: 0xffffff,
    // //   flatShading: true,
    // });

    // let floor = new THREE.Mesh(floorGeometry, floorMaterial);
    // floor.rotation.x = -0.5 * Math.PI; // This is 90 degrees by the way
    // floor.receiveShadow = true;
    // floor.position.y = -10;
    // this.scene.add(floor);
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

    // let geometrySphere = new THREE.SphereGeometry(8, 32, 32);
    // let materialSphere = new THREE.MeshPhysicalMaterial({ color: 0xf2ce2e }); // 0xf2ce2e
    // let sphere = new THREE.Mesh(geometrySphere, materialSphere);
    // sphere.position.z = -80;
    // sphere.position.y = -3;
    // sphere.position.x = -30;
    // sphere.scale.set(0.5, 0.5, 0.5);
    // this.scene.add(sphere);

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
        model.position.z = 30;
        model.castShadow = true;

        // Add model to this.scene
        self.scene.add(model);

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

  componentDidUpdate(nextProps, nextState) {
    // return nextProps.sliderValue !== this.props.sliderValue;
    if (nextProps.sliderValue !== this.props.sliderValue) {
      const interval = [0, 1];

      let azimuth = Math.abs(nextProps.sliderValue / MAX_HOURS / 2);
      let inclination = Math.abs(nextProps.sliderValue / MAX_HOURS) / 2;

      //   if (inclination < 0.5) {
      //       inclination = 0.5;
      //   } else if (inclination > 0.9) {
      //       inclination = 0.9;
      //   }

      console.log("sliderValue ", nextProps.sliderValue);
      console.log("AZIMUTH ", azimuth);
      console.log("INCLINATION ", inclination);

      const theta = Math.PI * inclination - 0.5;
      const phi = 2 * Math.PI * azimuth - 0.5;

      const uniforms = this.sky.material.uniforms;
      uniforms["turbidity"].value = Math.abs(nextProps.sliderValue / 2);

      let x = Math.cos(phi) * 2;
      this.sun.setX(x);
      console.log("SUN ", this.sun);

      //   let y = Math.abs(Math.sin(phi) * Math.sin(theta));
      //   if (y < 0.5) {
      //     y = 0.5;
      //   }
      let y = Math.cos(phi) * Math.cos(theta) * 0.05;

      this.sun.setY(y);
      //   this.sun.setZ(Math.cos(phi) * Math.sin(theta));

      uniforms["sunPosition"].value.copy(this.sun);

      console.log({
        x: x,
        y: y,
        z: Math.sin(phi) * Math.cos(theta),
      });

      console.log("sliderValue NEXT PROPS ", nextProps.sliderValue);
    }
  }

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

const HeroAnimation = () => {
  const [endingValue, setEndingValue] = useState();
  const [time, setTime] = useState(new Date());
  const [sliderValue, setSliderValue] = useState(time.getHours() - MAX_HOURS);
  const size = useWindowSize();

  useEffect(() => {
    let timerID = setInterval(() => tick(), 1000 * 60);
    return function cleanup() {
      clearInterval(timerID);
    };
  });

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
                },
              }}
              onControlFinished={() => setEndingValue(sliderValue)}
              arcColor="#48bb78"
              arcBackgroundColor="#3c366b"
            />
          </Styled.Slider>
          <Styled.AnimationWrapper
            animationWidth={animationWidth}
            windowHeight={size.height}
          >
            <ThreeAnimation sliderValue={sliderValue} />
          </Styled.AnimationWrapper>
        </Styled.SliderWrapper>
      </Container>
    </>
  );
};

// HeroAnimation.propTypes = {};

function useWindowSize() {
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
  }, [windowSize]); // Empty array ensures that effect is only run on mount

  return windowSize;
}

export default HeroAnimation;
