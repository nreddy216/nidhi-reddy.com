import React from "react";
import PropTypes from "prop-types";
import CircularSlider from "react-circular-slider-svg";
import { useState, useEffect } from "react";

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import Container from "components/ui/Container";

import * as Styled from "./styles";

const SLIDER_SIZE = 600;

class ThreeAnimation extends React.Component {
  componentDidMount() {
    let scene,
      renderer,
      camera,
      model, // Our character
      neck, // Reference to the neck bone in the skeleton
      waist, // Reference to the waist bone in the skeleton
      possibleAnims, // Animations found in our file
      mixer, // THREE.js animations mixer
      idle, // Idle, the default state our character returns to
      clock = new THREE.Clock(), // Used for anims, which run to a clock instead of frame rate
      currentlyAnimating = false, // Used to check whether characters neck is being used in another anim
      raycaster = new THREE.Raycaster(), // Used to detect the click on our character
      canvas;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 70;
    camera.position.x = 2;
    camera.position.y = 2;
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true;
    renderer.setPixelRatio(window.devicePixelRatio);

    // scene.background = new THREE.Color(0xbfe3dd);
    scene.fog = new THREE.Fog(0xbfe3dd, 60, 100);

    // Append to DOM
    this.mount.appendChild(renderer.domElement);

    // Add lights
    let hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.61);
    hemiLight.position.set(0, 50, 0);
    // Add hemisphere light to scene
    scene.add(hemiLight);

    let d = 8.25;
    let dirLight = new THREE.DirectionalLight(0xffffff, 0.54);
    dirLight.position.set(-8, 12, 8);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 1500;
    dirLight.shadow.camera.left = d * -1;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = d * -1;
    // Add directional Light to scene
    scene.add(dirLight);

    // Floor
    let floorGeometry = new THREE.PlaneGeometry(400, 150, 1, 1);
    let floorMaterial = new THREE.MeshPhongMaterial({
      color: 0xfa8072,
      shininess: 0,
    });

    let floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -0.5 * Math.PI; // This is 90 degrees by the way
    floor.receiveShadow = true;
    floor.position.y = -30;
    scene.add(floor);

    function update() {
      if (mixer) {
        mixer.update(clock.getDelta());
      }
      if (resizeRendererToDisplaySize(renderer)) {
        canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }
      renderer.render(scene, camera);
      requestAnimationFrame(update);
    }

    update();

    function resizeRendererToDisplaySize(renderer) {
      canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
      const pixelRatio = window.devicePixelRatio;
      let width = ((canvas.clientWidth / 3) * pixelRatio) | 0;
    //   let height = ((canvas.clientHeight / 3) * pixelRatio) | 0;
        let height = width;

      const needResize = canvas.width !== width || canvas.height !== height;
      if (needResize) {
        renderer.setSize(width, height, false);
      }
      return needResize;
    }

    let geometrySphere = new THREE.SphereGeometry(8, 32, 32);
    let materialSphere = new THREE.MeshPhysicalMaterial({ color: 0xf2ce2e }); // 0xf2ce2e
    let sphere = new THREE.Mesh(geometrySphere, materialSphere);
    sphere.position.z = -80;
    sphere.position.y = -3;
    sphere.position.x = -30;
    sphere.scale.set(0.5, 0.5, 0.5);
    scene.add(sphere);

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

    var loader = new GLTFLoader();
    var self = this;
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
        model.position.y = -30;
        model.position.z = 30;

        // Add model to scene
        scene.add(model);

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
    return false;
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
  const [value1, setValue1] = useState(time.getHours());
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
  let animationWidth = size.width >= SLIDER_SIZE * 2 ? SLIDER_SIZE * 2 - padding : size.width - padding;

  return (
    <>
      <Container className="relative">
        <Styled.SliderWrapper sliderSize={width}>
          <Styled.Slider>
            <CircularSlider
              size={width}
              minValue={0}
              maxValue={24}
              handle1={{
                value: value1,
                onChange: (v) => {
                  setValue1(v);
                },
              }}
              onControlFinished={() => setEndingValue(value1)}
              arcColor="#48bb78"
              arcBackgroundColor="#3c366b"
            />
          </Styled.Slider>
          <Styled.AnimationWrapper animationWidth={animationWidth} windowHeight={size.height}>
            <ThreeAnimation />
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
    height: SLIDER_SIZE
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
