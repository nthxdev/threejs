import * as THREE from 'three';
import { Water } from 'three/addons/objects/Water.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

const camera = new THREE.PerspectiveCamera( 60, window.innerWidth/window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowShadowMap;
document.body.appendChild(renderer.domElement);

// WATER WITH REALISTIC PHYSICS
const textureLoader = new THREE.TextureLoader();
const waterNormals = textureLoader.load('https://threejs.org/examples/textures/waternormals.jpg', function (texture) {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
});

const waterGeometry = new THREE.PlaneGeometry(20, 20, 256, 256);
const water = new Water(waterGeometry, {
    textureWidth: 1024,
    textureHeight: 1024,
    waterNormals: waterNormals,
    sunDirection: new THREE.Vector3(5, 10, 5).normalize(),
    sunColor: 0xffffff,
    waterColor: 0x0077be,
    eye: camera.position,
    distortionScale: 8.5,
    alpha: 0.9,
    fog: scene.fog !== undefined
});

water.rotation.x = -Math.PI / 2;
water.position.y = -1.8;
water.position.z = 0;
scene.add(water);

// CAUSTICS SHADER
const causticsShader = {
    uniforms: {
        time: { value: 0 }
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform float time;
        varying vec2 vUv;
        
        void main() {
            vec2 uv = vUv;
            vec3 caustic = vec3(0.0);
            
            caustic += sin(uv.x * 10.0 + time * 0.3) * 0.5;
            caustic += sin(uv.y * 10.0 + time * 0.2) * 0.5;
            caustic += cos((uv.x + uv.y) * 7.0 - time * 0.4) * 0.3;
            
            gl_FragColor = vec4(caustic * 0.4, 0.2);
        }
    `
};

const causticsMat = new THREE.ShaderMaterial(causticsShader);
const causticsGeom = new THREE.PlaneGeometry(20, 20);
const caustics = new THREE.Mesh(causticsGeom, causticsMat);
caustics.rotation.x = -Math.PI / 2;
caustics.position.y = -1.7;
caustics.position.z = 0;
scene.add(caustics);

// RED CUBE WITH SHADOW
const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshStandardMaterial({ color: "red", roughness: 0.7 });
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
const lineMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff, linewidth: 2 });
const line = new THREE.Line(lineGeometry, lineMaterial);
scene.add(line);

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

camera.position.set(0, 2, 5);
camera.lookAt(0, 0, 0);

// CURSOR TRACKING
let cursorX = 0;
let cursorY = 0;

window.addEventListener('mousemove', (e) => {
    cursorX = (e.clientX / window.innerWidth) * 2 - 1;
    cursorY = -(e.clientY / window.innerHeight) * 2 + 1;
});

// MOUSE DRAGGING CONTROLS
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

window.addEventListener('mousedown', (e) => {
    isDragging = true;
    previousMousePosition = { x: e.clientX, y: e.clientY };
});

window.addEventListener('mousemove', (e) => {
    if (isDragging) {
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;
        
        camera.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), deltaX * 0.005);
        camera.position.applyAxisAngle(camera.getWorldDirection(new THREE.Vector3()).cross(new THREE.Vector3(0, 1, 0)), deltaY * 0.005);
        
        camera.lookAt(0, 0, 0);
        previousMousePosition = { x: e.clientX, y: e.clientY };
    }
});

window.addEventListener('mouseup', () => {
    isDragging = false;
});

// TOUCH CONTROLS FOR MOBILE
let previousTouchPosition = { x: 0, y: 0 };

window.addEventListener('touchstart', (e) => {
    previousTouchPosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
});

window.addEventListener('touchmove', (e) => {
    const deltaX = e.touches[0].clientX - previousTouchPosition.x;
    const deltaY = e.touches[0].clientY - previousTouchPosition.y;
    
    camera.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), deltaX * 0.005);
    camera.position.applyAxisAngle(camera.getWorldDirection(new THREE.Vector3()).cross(new THREE.Vector3(0, 1, 0)), deltaY * 0.005);
    
    camera.lookAt(0, 0, 0);
    previousTouchPosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
});

renderer.setAnimationLoop(animate);
function animate(time){
    // UPDATE WATER - ACCESS CORRECT UNIFORM
    water.material.uniforms['time'].value += 1.0 / 60.0;
    
    // UPDATE CAUSTICS
    causticsMat.uniforms.time.value += 0.016;

    // CUBE ANIMATION WITH CURSOR FOLLOW
    cube.rotation.x = time/1000 + cursorY * 0.3;
    cube.rotation.y = time/500 + cursorX * 0.3;
    cube.rotation.z = time/2000;
    cube.position.x = cursorX * 0.5;
    cube.position.y = cursorY * 0.5;

    // LINE ANIMATION WITH CURSOR FOLLOW
    line.rotation.x = time / 1000 + cursorY * 0.2;
    line.rotation.y = time / 500 + cursorX * 0.2;
    line.position.x = Math.sin(time / 1000) + cursorX * 0.3;
    line.position.y = Math.cos(time / 1000) + cursorY * 0.3;

    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});