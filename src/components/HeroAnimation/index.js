import React, { Suspense } from "react";
import PropTypes from "prop-types";
import { useState, useEffect, memo } from "react";

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Sky } from "three/examples/jsm/objects/Sky.js";
import Cloud from "./cloud";
import Sparkle from "../../assets/images/sparkle-white.png";

import Container from "components/ui/Container";

import * as Styled from "./styles";

const CircularSlider = React.lazy(() => import("react-circular-slider-svg"));

const SLIDER_SIZE = 600;
const MAX_HOURS = 12;

// remap value from the range of [smin,smax] to [emin,emax]
const map = (val, smin, smax, emin, emax) =>
  ((emax - emin) * (val - smin)) / (smax - smin) + emin;
//randomly displace the x,y,z coords by the `per` value
const jitter = (geo, per) =>
  geo.vertices.forEach((v) => {
    v.x += map(Math.random(), 0, 1, -per, per);
    v.y += map(Math.random(), 0, 1, -per, per);
    v.z += map(Math.random(), 0, 1, -per, per);
  });

const getRandom = () => {
  var num = Math.floor(Math.random() * 60) + 1; // this will get a number between 1 and x;
  num *= Math.floor(Math.random() * 2) == 1 ? 1 : -1; // this will add minus sign in 50% of cases
  return num;
};

class ThreeAnimation extends React.Component {
  constructor(props) {
    super(props);
  }

  shiftClouds = (sliderValue) => {
    const MAX_CLOUD_X = 40;
    const SLOW_CLOUD_INCREMENT = 0.01;
    if (typeof sliderValue !== "undefined") {
      if (this.cloudsA.position.x > MAX_CLOUD_X) {
        this.cloudsA.position.x = -MAX_CLOUD_X;
      } else {
        this.cloudsA.position.x += sliderValue / (MAX_HOURS * 1.5);
      }

      if (this.cloudsB.position.x > MAX_CLOUD_X) {
        this.cloudsB.position.x = -MAX_CLOUD_X;
      } else {
        this.cloudsB.position.x += sliderValue / (MAX_HOURS * 1.5);
      }
    } else {
      if (this.cloudsA.position.x > MAX_CLOUD_X) {
        this.cloudsA.position.x = -MAX_CLOUD_X;
      } else {
        this.cloudsA.position.x += SLOW_CLOUD_INCREMENT;
      }

      if (this.cloudsB.position.x > MAX_CLOUD_X) {
        this.cloudsB.position.x = -MAX_CLOUD_X;
      } else {
        this.cloudsB.position.x += SLOW_CLOUD_INCREMENT;
      }
    }
  };

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

    THREE.Cache.enabled = true;
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
    // this.scene.fog = new THREE.Fog(0xbfe3dd, 60, 10);

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

    // TODO: Decide if this should exist or not.
    // const light2 = new THREE.DirectionalLight(0xff5566, 0.7);
    // light2.position.set(-2, -1, 0).normalize();
    // this.scene.add(light2);

    let d = 8.25;
    this.dirLightIntensity =
      -Math.abs(this.props.sliderValue / MAX_HOURS) + 0.85;
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
    floor.rotation.x = -0.35 * Math.PI; // 90 deg rotation
    floor.receiveShadow = true;
    floor.position.y = -35;
    floor.position.z = -10;
    this.scene.add(floor);

    const resizeRendererToDisplaySize = (renderer) => {
      canvas = renderer.domElement;
      this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
      this.camera.updateProjectionMatrix();
      const pixelRatio = window.devicePixelRatio;
      let width = ((canvas.clientWidth / 3) * pixelRatio) | 0;
      let height = width;

      const needResize = canvas.width !== width || canvas.height !== height;
      if (needResize) {
        renderer.setSize(width, height, false);
      }
      return needResize;
    };

    // Fake sun
    let fakeSunGeometrySphere = new THREE.SphereBufferGeometry(8, 12, 12);
    let fakeSunMaterialSphere = new THREE.MeshStandardMaterial({
      color: 0xf2ce2e,
      shadowSide: THREE.BackSide,
      emissive: "#F8CE3B",
    });
    this.fakeSun = new THREE.Mesh(fakeSunGeometrySphere, fakeSunMaterialSphere);

    const fakeSunRadius = 12 / Math.PI;
    let fakeSunTheta = this.props.sliderValueTotal / fakeSunRadius;

    this.fakeSun.position.x = fakeSunRadius * Math.sin(fakeSunTheta) * 6;
    this.fakeSun.position.y = fakeSunRadius * Math.cos(fakeSunTheta) * 6;
    this.fakeSun.position.z = -80;
    this.fakeSun.scale.set(0.5, 0.5, 0.5);
    this.scene.add(this.fakeSun);

    // Moon
    const moonGeometrySphere = new THREE.SphereGeometry(8, 32, 32);
    const moonLuminosity = Math.abs(this.props.sliderValue / MAX_HOURS);
    const moonMaterialSphere = new THREE.MeshStandardMaterial({
      color: 0xf2ce2e,
      // fog: false, // affected by fog or not
      shadowSide: THREE.BackSide,
      emissive: "#fff",
      emissiveIntensity: moonLuminosity,
      opacity: moonLuminosity,
      transparent: true,
      flatShading: false,
    });
    this.moon = new THREE.Mesh(moonGeometrySphere, moonMaterialSphere);

    const moonRadius = 12 / Math.PI;
    let moonTheta = this.props.sliderValueTotal / moonRadius;

    this.moon.position.x = -moonRadius * Math.sin(moonTheta) * 6;
    this.moon.position.y = -moonRadius * Math.cos(moonTheta) * 6;
    this.moon.position.z = -90;
    this.moon.scale.set(0.6, 0.6, 0.6);
    this.scene.add(this.moon);

    // Clouds
    this.cloudsA = new THREE.Object3D();
    const cloudGeo = new THREE.Geometry();

    const tuft1 = new THREE.SphereGeometry(1.25, 7, 8);
    tuft1.translate(-2, -0.4, 0);
    cloudGeo.merge(tuft1);

    const tuft2 = new THREE.SphereGeometry(1.75, 7, 8);
    tuft2.translate(2, 0, 0);
    cloudGeo.merge(tuft2);

    const tuft3 = new THREE.SphereGeometry(2.0, 7, 8);
    tuft3.translate(0, 0.3, 0);
    cloudGeo.merge(tuft3);

    // TODO: Remove if not using.
    cloudGeo.mergeVertices();
    // cloudGeo.computeFlatVertexNormals();
    cloudGeo.computeVertexNormals();

    jitter(cloudGeo, 0.1);

    const cloud1 = new THREE.Mesh(
      cloudGeo,
      new THREE.MeshLambertMaterial({
        color: "white",
        flatShading: true,
        shininess: 0,
      })
    );

    cloud1.material.morphTargets = true;

    cloud1.position.x = 10;
    cloud1.position.y = 10;
    cloud1.position.z = -20;
    this.cloudsA.add(cloud1);

    const cloud2 = cloud1.clone();

    cloud2.position.x = 0;
    cloud2.position.y = 4.5;
    cloud2.scale.set(1.2, 1.2, 1.2);
    cloud2.rotation.y = THREE.Math.degToRad(180);
    this.cloudsA.add(cloud2);

    const cloud3 = cloud1.clone();

    cloud3.position.x = -10;
    cloud3.position.y = 13.5;
    cloud3.scale.set(1.2, 1.2, 1.2);
    this.cloudsA.add(cloud3);

    this.cloudsB = this.cloudsA.clone();
    this.cloudsB.position.x = -40;

    this.scene.add(this.cloudsA);
    this.scene.add(this.cloudsB);

    // Stars
    const createStars = () => {
      const starTexture = new THREE.TextureLoader().load(Sparkle);

      this.stars = [];
      this.starsGroup = new THREE.Object3D();

      for (let i = 0; i < 90; i++) {
        let geometry = new THREE.PlaneGeometry(2, 2);
        let material = new THREE.MeshBasicMaterial({
          map: starTexture,
          transparent: true,
          opacity: 0.5,
        });
        let star = new THREE.Mesh(geometry, material);
        let starZ = getRandom();
        starZ = starZ > 0 ? -100 : starZ - 120;
        star.position.set(getRandom(), getRandom(), starZ);
        star.material.side = THREE.DoubleSide;
        this.stars.push(star);
        this.starsGroup.add(star);
      }

      for (let j = 0; j < this.stars.length; j++) {
        this.scene.add(this.stars[j]);
      }
    };

    createStars();

    // const MODEL_PATH =
    //   "https://s3-us-west-2.amazonaws.com/s.cdpn.io/1376484/stacy_lightweight.glb"
    const MODEL_PATH =
      "https://s3.us-east-2.amazonaws.com/nidhi-reddy.com/models/mixamo-big-hair-001.glb";

    let nidhi_txt = new THREE.TextureLoader().load(
      "https://s3.us-east-2.amazonaws.com/nidhi-reddy.com/models/mixamo-big-hair-001-texture.png"
    );

    nidhi_txt.flipY = false; // we flip the texture so that its the right way up

    const nidhi_mtl = new THREE.MeshPhongMaterial({
      map: nidhi_txt,
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
            o.material = nidhi_mtl;
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
        const MODEL_SCALE = 12;
        model.scale.set(MODEL_SCALE, MODEL_SCALE, MODEL_SCALE);
        model.position.x = 1.5;
        model.position.y = -12;
        model.position.z = 0;
        model.castShadow = true;

        // TODO: Uncomment when ready
        // Add model to this.scene
        // self.scene.add(model);

        // Remove loader
        // self.loaderAnim.remove();

        mixer = new THREE.AnimationMixer(model);

        // Animations
        let walkAnim = THREE.AnimationClip.findByName(
          fileAnimations,
          "femaleWalk"
        );
        walkAnim.tracks.splice(3, 3);
        walkAnim.tracks.splice(9, 3);
        self.walk = mixer.clipAction(walkAnim);

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

    this.starLightness = 0;
    const twinkleStars = (delta) => {
      for (let k = 0; k < this.stars.length; k++) {
        let star = this.stars[k];
        star.rotation.y > 0.1
          ? (star.rotation.y = 0.1)
          : (star.rotation.y += 0.01);
        star.rotation.z += 0.01;
        const starScaleDifference = (Math.random() > 0.5 ? -1 : 1) * 2 * delta;
        if (
          this.props.sliderValueTotal > 17 ||
          this.props.sliderValueTotal < 7
        ) {
          star.scale.x = 0;
          star.scale.y = 0;
        } else if (star.scale.x > 1) {
          star.scale.x = 1;
          star.scale.y = 1;
        } else if (star.scale.x < 0) {
          star.scale.x = 0;
          star.scale.y = 0;
        } else {
          star.scale.x += starScaleDifference;
          star.scale.y += starScaleDifference;
        }
      }
    };

    const update = () => {
      const delta = clock.getDelta();
      if (mixer) {
        mixer.update(delta);
      }
      if (resizeRendererToDisplaySize(this.renderer)) {
        canvas = this.renderer.domElement;
        this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
        this.camera.updateProjectionMatrix();
      }

      // Move clouds
      this.shiftClouds();

      // Twinkle stars
      twinkleStars(delta);

      this.renderer.render(this.scene, this.camera);
      requestAnimationFrame(update);
    };

    update();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.sliderValue !== this.props.sliderValue;
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.sliderValue !== this.props.sliderValue) {
      if (typeof this != "undefined" && typeof this.walk != "undefined") {
        this.walk.play();
      }

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

      // const sunLuminosity = Math.abs(MAX_HOURS * (Math.ceil(Math.random() * nextProps.sliderValue)));
      // this.fakeSun.material.emissiveIntensity = sunLuminosity;

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

      // Clouds
      this.shiftClouds(nextProps.sliderValueTotal);

      console.log("sliderValueTotal NEXT PROPS ", nextProps.sliderValueTotal);
    }
  }

  componentWillUnmount() {}

  render() {
    return (
      <div ref={(ref) => (this.mount = ref)}>
        {/* TODO: Add loading animation */}
        {/* <Styled.LoaderAnim ref={(ref) => (this.loaderAnim = ref)}>
          <Styled.Loader>Loading...</Styled.Loader>
        </Styled.LoaderAnim> */}
      </div>
    );
  }
}

const HeroAnimation = memo(() => {
  const time = new Date();
  const [sliderValue, setSliderValue] = useState(time.getHours() - MAX_HOURS);
  const [sliderValueTotal, setSliderValueTotal] = useState(
    time.getHours() - MAX_HOURS
  );
  const size = useWindowSize();

  console.log("sliderValueTotal CURRENT: ", sliderValueTotal);

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
            <Suspense fallback={<div>Loading...</div>}>
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
            </Suspense>
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
