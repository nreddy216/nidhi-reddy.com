import * as Styled from "./styles";

import {
  AnimationClip,
  AnimationMixer,
  BackSide,
  CanvasTexture,
  ClampToEdgeWrapping,
  Clock,
  Color,
  DirectionalLight,
  DoubleSide,
  Geometry,
  HemisphereLight,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  NearestFilter,
  Object3D,
  PerspectiveCamera,
  PlaneBufferGeometry,
  PlaneGeometry,
  Scene,
  SphereBufferGeometry,
  SphereGeometry,
  TextureLoader,
  Math as ThreeMath,
  Vector2,
  Vector3,
  WebGLRenderer,
  sRGBEncoding
} from "three";
import { memo, useEffect, useState } from "react";

// import CircleSlider from "circle-slider";
// import CircularSlider from "react-circular-slider-svg";
import CircleSlider from "./circleSlider";
import Container from "components/ui/Container";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { ImprovedNoise } from "three/examples/jsm/math/ImprovedNoise.js";
import React from "react";
import { Sky } from "three/examples/jsm/objects/Sky.js";
import Sparkle from "../../assets/images/sparkle-white.png";
import { isInBrowser } from "../../helpers/constants";

const SLIDER_SIZE = 600;
const MAX_HOURS = 12;

const worldWidth = 100;
const worldDepth = 100;

// remap value from the range of [smin,smax] to [emin,emax]
const map = (val, smin, smax, emin, emax) =>
  ((emax - emin) * (val - smin)) / (smax - smin) + emin;

//randomly displace the x,y,z coords by the `per` value
const jitter = (geo, per) =>
  geo.vertices.forEach(v => {
    v.x += map(Math.random(), 0, 1, -per, per);
    v.y += map(Math.random(), 0, 1, -per, per);
    v.z += map(Math.random(), 0, 1, -per, per);
  });

const getRandom = () => {
  var num = Math.floor(Math.random() * 60) + 1; // this will get a number between 1 and x;
  num *= Math.floor(Math.random() * 2) === 1 ? 1 : -1; // this will add minus sign in 50% of cases
  return num;
};

const generateGroundHeight = (width, height) => {
  const size = width * height,
    data = new Uint8Array(size),
    perlin = new ImprovedNoise(),
    z = 80;

  let quality = 1;

  for (let j = 0; j < 4; j++) {
    for (let i = 0; i < size; i++) {
      const x = i % width,
        y = ~~(i / width);
      data[i] += Math.abs(
        perlin.noise(x / quality, y / quality, z) * quality * 1.75
      );
    }

    quality *= 5;
  }

  return data;
};

const generateGroundTexture = (data, width, height) => {
  let context, image, imageData, shade;

  const vector3 = new Vector3(0, 0, 0);

  const sun = new Vector3(1, 1, 1);
  sun.normalize();

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  context = canvas.getContext("2d");
  context.fillStyle = "#000";
  context.fillRect(0, 0, width, height);

  image = context.getImageData(0, 0, canvas.width, canvas.height);
  imageData = image.data;

  for (let i = 0, j = 0, l = imageData.length; i < l; i += 4, j++) {
    vector3.x = data[j - 2] - data[j + 2];
    vector3.y = 2;
    vector3.z = data[j - width * 2] - data[j + width * 2];
    vector3.normalize();

    shade = vector3.dot(sun);

    imageData[i] = (96 + shade * 128) * (0.5 + data[j] * 0.007);
    imageData[i + 1] = (32 + shade * 96) * (0.5 + data[j] * 0.007);
    imageData[i + 2] = shade * 96 * (0.5 + data[j] * 0.007);
  }

  context.putImageData(image, 0, 0);

  // Scaled 4x
  const canvasScaled = document.createElement("canvas");
  canvasScaled.width = width * 4;
  canvasScaled.height = height * 4;

  context = canvasScaled.getContext("2d");
  context.scale(4, 4);
  context.drawImage(canvas, 0, 0);

  image = context.getImageData(0, 0, canvasScaled.width, canvasScaled.height);
  imageData = image.data;

  for (let i = 0, l = imageData.length; i < l; i += 4) {
    const v = ~~(Math.random() * 5);

    imageData[i] += v;
    imageData[i + 1] += v;
    imageData[i + 2] += v;
  }

  context.putImageData(image, 0, 0);

  return canvasScaled;
};

class ThreeAnimation extends React.Component {
  constructor(props) {
    super(props);

    this.laptopMovingDown = true;
  }

  createGround = () => {
    const data = generateGroundHeight(worldWidth, worldDepth);

    const geometry = new PlaneBufferGeometry(
      256,
      100,
      worldWidth - 1,
      worldDepth - 1
    );
    geometry.rotateX(-Math.PI / 2);

    const vertices = geometry.attributes.position.array;

    for (let i = 0, j = 0, l = vertices.length; i < l; i++, j += 3) {
      vertices[j + 1] = data[i] * 0.5;
    }

    this.groundTexture = new CanvasTexture(
      generateGroundTexture(data, worldWidth, worldDepth)
    );
    this.groundTexture.needsUpdate = true;
    this.groundTexture.wrapS = ClampToEdgeWrapping;
    this.groundTexture.wrapT = ClampToEdgeWrapping;

    this.groundMesh = new Mesh(
      geometry,
      new MeshPhysicalMaterial({
        map: this.groundTexture,
        color: 0xd3d3d3,
        flatShading: true
      })
    );
    this.groundMesh.position.set(0, -58, 30);
    this.groundMesh.rotation.x = ThreeMath.degToRad(20);
    this.groundMesh.scale.set(2, 1, 2);
    this.scene.add(this.groundMesh);
  };

  shiftClouds = sliderValue => {
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

  floatLaptop = () => {
    if (this.laptop) {
      if (this.laptop.position.y < 0.87) {
        this.laptopMovingDown = false;
      } else if (this.laptop.position.y > 0.9) {
        this.laptopMovingDown = true;
      }

      if (this.laptopMovingDown) {
        this.laptop.position.y -= 0.0002;
      } else {
        this.laptop.position.y += 0.0002;
      }
    }
  };

  twinkleStars = delta => {
    for (let k = 0; k < this.stars.length; k++) {
      let star = this.stars[k];
      star.rotation.y > 0.1
        ? (star.rotation.y = 0.1)
        : (star.rotation.y += 0.01);
      star.rotation.z += 0.01;
      const starScaleDifference = (Math.random() > 0.5 ? -1 : 1) * 2 * delta;
      if (
        this.props.sliderValueTotal > 17 ||
        this.props.sliderValueTotal < 7 ||
        star.scale.x < 0
      ) {
        star.scale.x = 0;
        star.scale.y = 0;
      } else if (star.scale.x > 1) {
        star.scale.x = 1;
        star.scale.y = 1;
      } else {
        star.scale.x += starScaleDifference;
        star.scale.y += starScaleDifference;
      }
    }
  };

  createSky = () => {
    this.sky = new Sky();
    this.sky.scale.setScalar(4500);
    this.scene.add(this.sky);

    this.sun = new Vector3();

    this.skyEffectValues = {
      turbidity: 10,
      rayleigh: Math.abs(this.props.sliderValue / MAX_HOURS) * 2 + 0.6,
      mieCoefficient: 0.005,
      mieDirectionalG: 0.7,
      inclination: Math.abs(this.props.sliderValue / MAX_HOURS / 2),
      azimuth: Math.abs(this.props.sliderValue / MAX_HOURS / 2),
      exposure: this.renderer.toneMappingExposure
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
  };

  addLights = () => {
    let hemiLight = new HemisphereLight(0xfed8b1, 0xfed8b1, 0.3);
    hemiLight.position.set(0, 0, 0);

    // Add hemisphere light to this.scene
    this.scene.add(hemiLight);

    let d = 8.25;
    this.dirLightIntensity =
      -Math.abs(this.props.sliderValue / MAX_HOURS) + 0.85;
    this.dirLight = new DirectionalLight(0xffffff, this.dirLightIntensity);
    this.dirLight.position.set(-3, 10, 2);
    this.dirLight.castShadow = false;
    this.dirLight.shadow.mapSize = new Vector2(1024, 1024);
    this.dirLight.shadow.camera.near = 0.1;
    this.dirLight.shadow.camera.far = 1500;
    this.dirLight.shadow.camera.left = d * -1;
    this.dirLight.shadow.camera.right = d;
    this.dirLight.shadow.camera.top = d;
    this.dirLight.shadow.camera.bottom = d * -1;

    // Add directional Light to this.scene
    this.scene.add(this.dirLight);
  };

  addSunAndMoon = () => {
    // Fake sun
    let fakeSunGeometrySphere = new SphereBufferGeometry(8, 12, 12);
    let fakeSunMaterialSphere = new MeshStandardMaterial({
      color: 0xf2ce2e,
      shadowSide: BackSide,
      emissive: "#F8CE3B"
    });
    this.fakeSun = new Mesh(fakeSunGeometrySphere, fakeSunMaterialSphere);

    const fakeSunRadius = 12 / Math.PI;
    let fakeSunTheta = this.props.sliderValueTotal / fakeSunRadius;

    this.fakeSun.position.x = fakeSunRadius * Math.sin(fakeSunTheta) * 6;
    this.fakeSun.position.y = fakeSunRadius * Math.cos(fakeSunTheta) * 6;
    this.fakeSun.position.z = -80;
    this.fakeSun.scale.set(0.5, 0.5, 0.5);
    this.scene.add(this.fakeSun);

    // Moon
    const moonGeometrySphere = new SphereGeometry(8, 32, 32);
    const moonLuminosity = Math.abs(this.props.sliderValue / MAX_HOURS);
    const moonMaterialSphere = new MeshStandardMaterial({
      color: 0xf2ce2e,
      shadowSide: BackSide,
      emissive: "#fff",
      emissiveIntensity: moonLuminosity,
      opacity: moonLuminosity,
      transparent: true,
      flatShading: false
    });
    this.moon = new Mesh(moonGeometrySphere, moonMaterialSphere);

    const moonRadius = 12 / Math.PI;
    let moonTheta = this.props.sliderValueTotal / moonRadius;

    this.moon.position.x = -moonRadius * Math.sin(moonTheta) * 6;
    this.moon.position.y = -moonRadius * Math.cos(moonTheta) * 6;
    this.moon.position.z = -90;
    this.moon.scale.set(0.6, 0.6, 0.6);
    this.scene.add(this.moon);
  };

  createClouds = () => {
    this.cloudsA = new Object3D();
    const cloudGeo = new Geometry();

    const tuft1 = new SphereGeometry(1.25, 7, 8);
    tuft1.translate(-2, -0.4, 0);
    cloudGeo.merge(tuft1);

    const tuft2 = new SphereGeometry(1.75, 7, 8);
    tuft2.translate(2, 0, 0);
    cloudGeo.merge(tuft2);

    const tuft3 = new SphereGeometry(2.0, 7, 8);
    tuft3.translate(0, 0.3, 0);
    cloudGeo.merge(tuft3);

    // Subdivide clouds
    cloudGeo.mergeVertices();
    cloudGeo.computeVertexNormals();

    // Unique-ify clouds
    jitter(cloudGeo, 0.1);

    const cloud1 = new Mesh(
      cloudGeo,
      new MeshLambertMaterial({
        color: "white",
        flatShading: true
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
    cloud2.rotation.y = ThreeMath.degToRad(180);
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
  };

  createStars = () => {
    const starTexture = new TextureLoader().load(Sparkle);

    this.stars = [];
    this.starsGroup = new Object3D();

    for (let i = 0; i < 90; i++) {
      let geometry = new PlaneGeometry(2, 2);
      let material = new MeshBasicMaterial({
        map: starTexture,
        transparent: true,
        opacity: 0.5
      });
      let star = new Mesh(geometry, material);
      let starZ = getRandom();
      starZ = starZ > 0 ? -100 : starZ - 120;
      star.position.set(getRandom(), getRandom(), starZ);
      star.material.side = DoubleSide;
      this.stars.push(star);
      this.starsGroup.add(star);
    }

    for (let j = 0; j < this.stars.length; j++) {
      this.scene.add(this.stars[j]);
    }
  };

  addModelAndLaptop() {
    let model, // Our character
      neck, // Reference to the neck bone in the skeleton
      waist, // Reference to the waist bone in the skeleton
      // TODO: For future update when there are more animations, uncomment this.
      // possibleAnims, // Animations found in our file
      // currentlyAnimating = false, // Used to check whether characters neck is being used in another anim
      // raycaster = new Raycaster(), // Used to detect the click on our character
      idle; // Idle, the default state our character returns to

    const MODEL_PATH =
      "https://s3.us-east-2.amazonaws.com/nidhi-reddy.com/models/nidhi-006.glb";

    let modelTexture = new TextureLoader().load(
      `https://s3.us-east-2.amazonaws.com/nidhi-reddy.com/models/nidhi-006-texture.jpg`
    );

    modelTexture.flipY = false; // we flip the texture so that its the right way up
    modelTexture.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
    modelTexture.minFilter = NearestFilter;

    const modelMaterial = new MeshPhysicalMaterial({
      map: modelTexture,
      skinning: true,
      color: 0xb48648
    });

    const loader = new GLTFLoader();
    loader.load(
      MODEL_PATH,
      gltf => {
        // A lot is going to happen here
        model = gltf.scene;
        let fileAnimations = gltf.animations;

        model.traverse(o => {
          if (o.isMesh) {
            o.castShadow = true;
            o.receiveShadow = true;
            o.material = modelMaterial;
          }

          // Reference the neck and waist bones
          if (o.isBone && o.name === "mixamorigNeck") {
            neck = o;
          }
          if (o.isBone && o.name === "mixamorigSpine") {
            waist = o;
            waist.rotation.x = ThreeMath.degToRad(-5);
          }
        });

        // Set the models initial scale
        const MODEL_SCALE = 8;
        model.scale.set(MODEL_SCALE, MODEL_SCALE, MODEL_SCALE);
        model.position.x = -4;
        model.position.y = -6;
        model.position.z = -4;
        model.rotation.y = ThreeMath.degToRad(45);

        model.castShadow = true;

        this.mixer = new AnimationMixer(model);

        let idleAnim = AnimationClip.findByName(fileAnimations, "typing");
        idleAnim.tracks.splice(3, 3);
        idleAnim.tracks.splice(9, 3);
        idle = this.mixer.clipAction(idleAnim);
        idle.play();

        // Laptop
        const LAPTOP_PATH = `https://s3.us-east-2.amazonaws.com/nidhi-reddy.com/models/laptop-001.glb`;

        const laptop_mtl = new MeshStandardMaterial({
          color: 0xd3d3d3,
          metalness: 0.5,
          skinning: true
        });

        // Add laptop to scene
        loader.load(
          LAPTOP_PATH,
          gltf => {
            this.laptop = gltf.scene;

            this.laptop.traverse(o => {
              if (o.isMesh) {
                o.castShadow = true;
                o.receiveShadow = true;
                o.material = laptop_mtl;
              }
            });

            this.laptop.castShadow = true;
            this.laptop.position.set(-0.5, 0.85, 1.3);
            this.laptop.scale.set(0.8, 0.8, 0.8);
            this.laptop.emissive = true;

            const laptopLight = new DirectionalLight(0x0000ff, 0.3);
            laptopLight.position.set(-0.5, 0.7, 1.2);
            laptopLight.castShadow = true;

            const laptopLightTarget = new Object3D();
            laptopLightTarget.position.set(-0.5, 0.6, 1.2);

            laptopLight.target = laptopLightTarget;

            this.scene.add(laptopLightTarget);

            model.add(this.laptop);
            this.scene.add(laptopLight);
            this.scene.add(model);
          },
          undefined, // We don't need this function
          function(error) {
            console.error(error);
          }
        );
      },
      undefined, // We don't need this function
      function(error) {
        console.error(error);
      }
    );

    document.addEventListener("mousemove", e => {
      var mousecoords = getMousePos(e);
      if (neck && waist && this.laptop) {
        moveJoint(mousecoords, neck, 50);
        moveJoint(mousecoords, waist, 10);
        moveJoint(mousecoords, this.laptop, 5);
      }
    });

    const getMousePos = e => {
      return { x: e.clientX, y: e.clientY };
    };

    const moveJoint = (mouse, joint, degreeLimit) => {
      let degrees = getMouseDegrees(mouse.x, mouse.y, degreeLimit);
      joint.rotation.y = ThreeMath.degToRad(degrees.x);
      joint.rotation.x = ThreeMath.degToRad(degrees.y / 2);
    };

    const getMouseDegrees = (x, y, degreeLimit) => {
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
    };
  }

  componentDidMount() {
    if (!isInBrowser) {
      return;
    }

    let clock = new Clock(); // Used for anims, which run to a clock instead of frame rate

    Cache.enabled = true;
    this.scene = new Scene();
    this.camera = new PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.x = 2;
    this.camera.position.y = 2;
    this.camera.position.z = 30;
    this.renderer = new WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.outputEncoding = sRGBEncoding;
    this.renderer.shadowMap.enabled = true;
    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.scene.background = new Color(0xefd1b5);

    // Create sunlight and sky
    this.createSky();

    // Append to DOM
    this.mount.appendChild(this.renderer.domElement);

    // Add lights
    this.addLights();

    // Add fake sun and fake moon
    this.addSunAndMoon();

    // Ground
    this.createGround();

    const resizeRendererToDisplaySize = renderer => {
      this.canvas = renderer.domElement;
      this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
      this.camera.updateProjectionMatrix();
      const pixelRatio = window.devicePixelRatio;
      let width = ((this.canvas.clientWidth / 3) * pixelRatio) | 0;
      let height = width;

      const needResize =
        this.canvas.width !== width || this.canvas.height !== height;
      if (needResize) {
        renderer.setSize(width, height, false);
      }
      return needResize;
    };

    // Clouds
    this.createClouds();

    // Stars
    this.createStars();

    // Add model and laptop
    this.addModelAndLaptop();

    const update = () => {
      const delta = clock.getDelta();

      if (this.mixer) {
        this.mixer.update(delta);
      }
      if (resizeRendererToDisplaySize(this.renderer)) {
        this.canvas = this.renderer.domElement;
        this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
        this.camera.updateProjectionMatrix();
      }

      // Move clouds
      this.shiftClouds();

      // Twinkle stars
      this.twinkleStars(delta);

      // Move laptop up and down
      this.floatLaptop();

      this.renderer.render(this.scene, this.camera);
      this.animationFrameId = window.requestAnimationFrame(update);
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
    }
  }

  componentWillUnmount() {
    if (isInBrowser) {
      if (this.animationFrameId) {
        window.cancelAnimationFrame(this.animationFrameId);
      }
    }
  }

  render() {
    return (
      <div ref={ref => (this.mount = ref)}>
        {/* TODO: Add loading animation */}
        {/* <Styled.LoaderAnim ref={(ref) => (this.loaderAnim = ref)}>
          <Styled.Loader>Loading...</Styled.Loader>
        </Styled.LoaderAnim> */}
      </div>
    );
  }
}

const useWindowSize = () => {
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
        height: window.innerHeight
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

const HeroAnimation = memo(() => {
  const time = new Date();
  const [sliderValue, setSliderValue] = useState(time.getHours() - MAX_HOURS);
  const [sliderValueTotal, setSliderValueTotal] = useState(
    time.getHours()
  );
  const size = useWindowSize();
  let slider;

  const padding = 40;
  let width =
    size.width - padding >= SLIDER_SIZE ? SLIDER_SIZE : size.width - padding;
  let animationWidth =
    size.width >= SLIDER_SIZE * 2
      ? SLIDER_SIZE * 2 - padding
      : size.width - padding;

  useEffect(() => {
    
    const options = {
      snap: 15,
      clockwise: true,
      startPos: 'bottom',
    };
    
    slider = new CircleSlider("circle-slider", options);
    
    const newAngle = (360 * sliderValueTotal) / (MAX_HOURS * 2);
    console.log("ANGLE ", newAngle, sliderValueTotal);
    slider.setAngle(newAngle);

    slider.on("sliderMove", setSliderValues);
  }, []);

  const setSliderValues = angle => {
    const valueTotal = (MAX_HOURS * 2) / (360 / angle);
    const value = valueTotal - MAX_HOURS;
    setSliderValueTotal(valueTotal);
    setSliderValue(value);
  };

  return (
    <>
      <Container className="relative">
        <Styled.SliderWrapper sliderSize={width}>
          <Styled.Slider>
            {/* <CircularSlider
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
            /> */}
            <Styled.CircleSlider
              sliderSize={width}
              id="circle-slider"
            ></Styled.CircleSlider>
          </Styled.Slider>
          <Styled.AnimationWrapper
            animationWidth={animationWidth}
            windowHeight={size.height}
          >
            {/* <ThreeAnimation
              sliderValue={sliderValue}
              sliderValueTotal={sliderValueTotal}
            /> */}
          </Styled.AnimationWrapper>
        </Styled.SliderWrapper>
      </Container>
    </>
  );
});

export default HeroAnimation;
