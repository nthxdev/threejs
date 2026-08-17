import * as THREE from "three";
import { lightPosition } from "three/src/nodes/TSL.js";
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({
  color: "red",
});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.set(0, 0, 4);
camera.lookAt(0, 0, 0);

// draw a line
const points = [];
points.push(new THREE.Vector3(-2, 0, 0));
points.push(new THREE.Vector3(0, 2, 0));
points.push(new THREE.Vector3(2, 0, 0));
points.push(new THREE.Vector3(0, -2, 0));
points.push(new THREE.Vector3(-2, 0, 0));

const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
const lineMaterial = new THREE.LineBasicMaterial({
  color: 0x0000ff,
});
const line = new THREE.Line(lineGeometry, lineMaterial);
scene.add(line);
renderer.render(scene, camera);

// renderer.setAnimationLoop(animate);
// function animate(time){
//     cube.rotation.x = time/1000;
//     cube.rotation.y = time/500;
//     cube.rotation.z = time/2000;

//     line.rotation.x = time / 1000;
//     line.rotation.y = time / 500;

//     line.position.x = Math.sin(time / 1000);
//     line.position.y = Math.cos(time / 1000);

//     const targetPos = new THREE.Vector3(
//         Math.sin(time / 3000) * 5,
//         Math.cos(time / 2500) * 3,
//         5 + Math.sin(time / 4000) * 2
//     );
//     camera.position.lerp(targetPos, 0.05);

//     const targetLook = new THREE.Vector3(
//         Math.sin(time / 2000) * 1.5,
//         Math.cos(time / 3000) * 1,
//         0
//     );
//     console.log(camera.position)
//     camera.lookAt(targetLook);

// }
