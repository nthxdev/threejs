import * as THREE from 'three';

/* =========================
   Scene Setup
========================= */

// Create the scene that will contain all 3D objects
const scene = new THREE.Scene();

/* =========================
   Camera Setup
========================= */

// Create a perspective camera
const camera = new THREE.PerspectiveCamera(
  75, // Vertical field of view in degrees
  window.innerWidth / window.innerHeight, // Aspect ratio
  0.1, // Near clipping plane
  100 // Far clipping plane
);

// Move the camera away from the cube
camera.position.z = 5;

/* =========================
   Renderer Setup
========================= */

// Create a WebGL renderer
// Three.js creates a canvas automatically when no canvas is provided
const renderer = new THREE.WebGLRenderer();

// Set the canvas size to match the browser window
renderer.setSize(
  window.innerWidth,
  window.innerHeight
);

// Add the renderer's canvas element to the HTML body
document.body.appendChild(renderer.domElement);

/* =========================
   Cube Setup
========================= */

// Create the cube's geometry: width, height, and depth
const geometry = new THREE.BoxGeometry(1, 1, 1);

// Create the cube's material
// MeshBasicMaterial does not require lighting
const material = new THREE.MeshBasicMaterial({
  color: 0x00ff00
});

// Combine the geometry and material into a visible 3D mesh
const cube = new THREE.Mesh(geometry, material);

// Add the cube to the scene
scene.add(cube);

/* =========================
   Animation Loop
========================= */

// Start the animation loop
// A render call draws only what is already inside the scene at that moment.
renderer.setAnimationLoop(animate);

// This function runs once per rendered frame
function animate(time) {
  // Rotate the cube using the elapsed time in milliseconds
  // Rotation expects radians, so the cube rotates about 1 radian per second. 180° = π radians
  // for 60 degree - cube.rotation.y = THREE.MathUtils.degToRad(60);
  cube.rotation.x = time / 2000;
  cube.rotation.y = time / 1000;

  // Render the scene from the camera's point of view
  renderer.render(scene, camera);
}
// draw a line
camera.position.set(0, 0, 30);
camera.lookAt(0, 0, 0);
const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x0000ff
});

const points = [];
// Vector3 returns an object stores that Vector3 object inside the points array. returns -> point.x which is -10
// points[0].x // -10
points.push(new THREE.Vector3(-10, 0, 0));
points.push(new THREE.Vector3(0, 10, 0));
points.push(new THREE.Vector3(10, 0, 0));
const lineGeometry = new THREE.BufferGeometry()
  .setFromPoints(points);
const line = new THREE.Line(
    lineGeometry,
    lineMaterial
);
scene.add(line);