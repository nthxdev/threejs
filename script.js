import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const threejsContainer = document.querySelector("#three-container");
const width = threejsContainer.clientWidth;
const height = threejsContainer.clientHeight;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(width, height);
camera.aspect = width / height;
camera.updateProjectionMatrix();

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowShadowMap;
threejsContainer.appendChild(renderer.domElement);

// WHITE FLOOR
const floorGeom = new THREE.PlaneGeometry(20, 20);
const floorMat = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  roughness: 0.5,
});
const floor = new THREE.Mesh(floorGeom, floorMat);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -2;
floor.receiveShadow = true;
scene.add(floor);

// WHITE WALLS
const wallGeom = new THREE.PlaneGeometry(20, 15);
const wallMat = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  roughness: 0.5,
});

const backWall = new THREE.Mesh(wallGeom, wallMat);
backWall.position.z = -10;
backWall.position.y = 5;
backWall.receiveShadow = true;
scene.add(backWall);

const leftWall = new THREE.Mesh(wallGeom, wallMat);
leftWall.rotation.y = Math.PI / 2;
leftWall.position.x = -10;
leftWall.position.y = 5;
leftWall.receiveShadow = true;
scene.add(leftWall);

const rightWall = new THREE.Mesh(wallGeom, wallMat);
rightWall.rotation.y = Math.PI / 2;
rightWall.position.x = 10;
rightWall.position.y = 5;
rightWall.receiveShadow = true;
scene.add(rightWall);

// RED CUBE WITH SHADOW
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({
  color: 0x7f7f7f,
  roughness: 0.7,
});
const cube = new THREE.Mesh(geometry, material);
cube.castShadow = true;
cube.receiveShadow = true;
scene.add(cube);

// LINE
const points = [];
points.push(new THREE.Vector3(-2, 0, 0));
points.push(new THREE.Vector3(0, 2, 0));
points.push(new THREE.Vector3(2, 0, 0));
points.push(new THREE.Vector3(0, -2, 0));
points.push(new THREE.Vector3(-2, 0, 0));

const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
const lineMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff });
const line = new THREE.Line(lineGeometry, lineMaterial);
scene.add(line);

console.log(window);
console.log(document);
console.log(THREE);

// SUN LIGHT FROM TOP
const sunLight = new THREE.DirectionalLight(0xffffff, 1.5);
sunLight.position.set(5, 10, 5);
sunLight.castShadow = true;
sunLight.shadow.mapSize.width = 2048;
sunLight.shadow.mapSize.height = 2048;
sunLight.shadow.camera.far = 50;
sunLight.shadow.camera.left = -15;
sunLight.shadow.camera.right = 15;
sunLight.shadow.camera.top = 15;
sunLight.shadow.camera.bottom = -15;
scene.add(sunLight);

// POINT LIGHT FROM TOP
const pointLight = new THREE.PointLight(0xffffff, 0.8);
pointLight.position.set(0, 8, 0);
pointLight.castShadow = true;
scene.add(pointLight);

// AMBIENT LIGHT
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

camera.position.set(0, 0, 4);
camera.lookAt(0, 0, 0);

// MOUSE DRAGGING CONTROLS
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

window.addEventListener("mousedown", (e) => {
  isDragging = true;
  previousMousePosition = { x: e.clientX, y: e.clientY };
});

window.addEventListener("mousemove", (e) => {
  if (isDragging) {
    const deltaX = e.clientX - previousMousePosition.x;
    const deltaY = e.clientY - previousMousePosition.y;

    camera.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), deltaX * 0.005);
    camera.position.applyAxisAngle(
      camera
        .getWorldDirection(new THREE.Vector3())
        .cross(new THREE.Vector3(0, 1, 0)),
      deltaY * 0.005,
    );

    camera.lookAt(0, 0, 0);
    previousMousePosition = { x: e.clientX, y: e.clientY };
  }
});

window.addEventListener("mouseup", () => {
  isDragging = false;
});

// TOUCH CONTROLS FOR MOBILE
let previousTouchPosition = { x: 0, y: 0 };

window.addEventListener("touchstart", (e) => {
  previousTouchPosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
});

window.addEventListener("touchmove", (e) => {
  const deltaX = e.touches[0].clientX - previousTouchPosition.x;
  const deltaY = e.touches[0].clientY - previousTouchPosition.y;

  camera.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), deltaX * 0.005);
  camera.position.applyAxisAngle(
    camera
      .getWorldDirection(new THREE.Vector3())
      .cross(new THREE.Vector3(0, 1, 0)),
    deltaY * 0.005,
  );

  camera.lookAt(0, 0, 0);
  previousTouchPosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
});

renderer.render(scene, camera);

const btn = document.querySelector(".animate");
console.log(btn);
btn.addEventListener("click", (e) => {
  console.log(e);
  console.log("clicked");
  renderer.setAnimationLoop(animate);
});

function animate(time) {
  cube.rotation.x = time / 1000;
  cube.rotation.y = time / 500;
  cube.rotation.z = time / 2000;

  line.rotation.x = time / 1000;
  line.rotation.y = time / 500;

  line.position.x = Math.sin(time / 1000);
  line.position.y = Math.cos(time / 1000);

  const targetPos = new THREE.Vector3(
    Math.sin(time / 500) * 5,
    Math.cos(time / 500) * 3,
    5 + Math.sin(time / 500) * 2,
  );

  camera.position.lerp(targetPos, 0.4);

  const targetLook = new THREE.Vector3(
    Math.sin(time / 2000) * 1.5,
    Math.cos(time / 3000) * 1,
    0,
  );
  console.log(camera.position);
  camera.lookAt(targetLook);
  renderer.render(scene, camera);
}

window.addEventListener("resize", () => {
  const width = container.clientWidth;
  const height = container.clientHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
});

// gsap
// gsap.to(".gsap", {
//   backgroundColor: "#032e09",
//   scrollTrigger: {
//       trigger: "#section1",
//       // start: "trigger viewport"
//       start: "top top",
//       markers: true,
//       scrub: true,
//       endTrigger: "#section4",
//       end: "top top"
//   }
// });

const time = gsap.timeline({
  scrollTrigger: {
    trigger: "#section1",
    // start: "trigger viewport"
    start: "top top",
    markers: true,
    scrub: true,
    endTrigger: "#section4",
    end: "top top",
  },
});
// timeline divided in two parts
time
.to(".gsap", {
    backgroundColor: "#042c11",
})
.to(".gsap", {
    backgroundColor: "#04052c",
})
