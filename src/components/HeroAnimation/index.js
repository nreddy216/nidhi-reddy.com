import React from "react";
import PropTypes from "prop-types";
import CircularSlider from "react-circular-slider-svg";
import { useState, useEffect } from "preact/hooks";

import * as THREE from "three";
import { THREEGLTFLoader } from "three-loaders";

import Container from "components/ui/Container";

import * as Styled from "./styles";

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
      raycaster = new THREE.Raycaster(); // Used to detect the click on our character

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 70;
    camera.position.x = 0.5;
    camera.position.y = 0;
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

    // var geometry = new THREE.BoxGeometry(1, 1, 1);
    // var material = new THREE.MeshBasicMaterial({ color: "#0099CC" });
    // var cube = new THREE.Mesh(geometry, material);
    // scene.add(cube);

    // camera.position.z = 5;
    // var animate = function() {
    //   requestAnimationFrame(animate);
    //   cube.rotation.x += 0.01;
    //   cube.rotation.y += 0.01;
    //   renderer.render(scene, camera);
    // };

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
    floor.position.y = -5;
    scene.add(floor);

    function update() {
      if (mixer) {
        mixer.update(clock.getDelta());
      }
      if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }
      renderer.render(scene, camera);
      requestAnimationFrame(update);
    }

    update();

    function resizeRendererToDisplaySize(renderer) {
      const canvas = renderer.domElement;
      let width = window.innerWidth;
      let height = window.innerHeight;
      let canvasPixelWidth = canvas.width / window.devicePixelRatio;
      let canvasPixelHeight = canvas.height / window.devicePixelRatio;

      const needResize =
        canvasPixelWidth !== width || canvasPixelHeight !== height;
      if (needResize) {
        renderer.setSize(width, height, false);
      }
      return needResize;
    }

    // animate();

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

    var loader = new THREEGLTFLoader();
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
        });

        // Set the models initial scale
        model.scale.set(10, 10, 10);
        model.position.y = -6;

        // Add model to scene
        scene.add(model);

        // Remove loader
        self.loaderAnim.remove();

        mixer = new THREE.AnimationMixer(model);
        let idleAnim = THREE.AnimationClip.findByName(fileAnimations, "idle");
        idle = mixer.clipAction(idleAnim);
        idle.play();
      },
      undefined, // We don't need this function
      function (error) {
        console.error(error);
      }
    );
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

  useEffect(() => {
    let timerID = setInterval(() => tick(), 1000 * 60);
    return function cleanup() {
      clearInterval(timerID);
    };
  });

  function tick() {
    setTime(new Date());
  }

  const sliderSize = 600;

  return (
    <>
      <Container className="relative">
        <Styled.SliderWrapper sliderSize={sliderSize}>
          <Styled.Slider>
            <CircularSlider
              style={`position: absolute;`}
              size={sliderSize}
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
          <div style={`overflow: hidden; width: 600px; border-radius: 600px;`}>
            <Styled.AnimationWrapper sliderSize={sliderSize}>
              <ThreeAnimation />
            </Styled.AnimationWrapper>
          </div>
        </Styled.SliderWrapper>
      </Container>
    </>
  );
};

// HeroAnimation.propTypes = {};

export default HeroAnimation;
