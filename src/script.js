import * as THREE from "three";
import { EXRLoader } from "three/examples/jsm/Addons.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// HDRI Environment Map
const exrLoader = new EXRLoader();
exrLoader.load(
  "https://dl.polyhaven.org/file/ph-assets/HDRIs/exr/1k/urban_alley_01_1k.exr",
  (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;
    scene.background = texture;
  }
);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(8, 2, 4);
scene.add(directionalLight);




// 3D Object
const torusRingGeometry = new THREE.TorusGeometry(0.3, 0.2, 64, 128);
const planeGeometry = new THREE.PlaneGeometry(1,1, 100, 100);
const sphereGeometry = new THREE.SphereGeometry(0.5, 64, 64);

const material = new THREE.MeshPhysicalMaterial({
    side: THREE.DoubleSide,
metalness: 0,
roughness: 0,
clearcoat: 1,
clearcoatRoughness: 0,
sheen: 1,
sheenRoughness: 0.25,
iridescence: 1,
iridescenceIOR: 1.3,
iridescenceThicknessRange: [100, 800],
transmission: 1,
ior: 1.5,
thickness: 0.5,
});

material.normalScale.set(0.5, 0.5)
material.sheenColor.set(1, 1, 1)

const torusRing = new THREE.Mesh(torusRingGeometry, material);
scene.add(torusRing);
torusRing.position.x = -1.5;

const plane = new THREE.Mesh(planeGeometry, material);
scene.add(plane);

const sphere = new THREE.Mesh(sphereGeometry, material);
scene.add(sphere);
sphere.position.x = 1.5;

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  torusRing.rotation.y = 0.1 * elapsedTime;
  plane.rotation.y = 0.1 * elapsedTime;
  sphere.rotation.y = 0.1 * elapsedTime;

  torusRing.rotation.x = -0.15 * elapsedTime;
  plane.rotation.x = -0.15 * elapsedTime;
  sphere.rotation.x = -0.15 * elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
