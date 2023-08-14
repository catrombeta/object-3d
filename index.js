import * as THREE from 'three';
import { Color } from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new Color(0x000000);
const sceneWidth = 100;
const sceneHeight = 100;
const sceneDepth = 100;

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    2000
);

const sceneCenter = new THREE.Vector3(sceneWidth / 2, sceneHeight / 2, sceneDepth / 2);
camera.position.copy(sceneCenter);

const lightOne = new THREE.PointLight( 0xc4c4c4, 1, 10000 );
lightOne.position.set( 0, 300, 500 );
scene.add( lightOne );

const lightTwo = new THREE.PointLight( 0xc4c4c4, 1, 10000 );
lightTwo.position.set( 500, 100, 0 );
scene.add( lightTwo );

const lightThree = new THREE.PointLight( 0xc4c4c4, 1, 10000 );
lightThree.position.set( 0, 100, -500 );
scene.add( lightThree );

const lightFour = new THREE.PointLight( 0xc4c4c4, 1, 10000 );
lightFour.position.set( -500, 300, 500 );
scene.add( lightFour );

const controls = new OrbitControls(camera, renderer.domElement);
controls.autoRotate = true;
controls.autoRotateSpeed = 1;
controls.minDistance = 3;
controls.maxDistance = 20;
controls.zoomSpeed = 0.2;
controls.enablePan = false;
controls.enabkeDamping = true;
camera.position.set(0, 20, 100);
controls.update();

const mtlLoader = new MTLLoader();
mtlLoader.setPath('./assets/');
mtlLoader.load('aeronave.mtl', (materials) => {
    materials.preload();
    const objLoader = new OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.setPath('./assets/');

    objLoader.load('aeronave.obj', (object) => {
        const objectSize = new THREE.Vector3();
        const objectBox = new THREE.Box3().setFromObject(object);
        objectBox.getSize(objectSize);

        // Calcular a escala do objeto com base nas dimensões
        const maxSize = Math.max(objectSize.x, objectSize.y, objectSize.z);
        const desiredSize = 5; // Tamanho desejado para o objeto
        const scale = desiredSize / maxSize;
        
        // Aplicar a escala ao objeto
        object.scale.set(scale, scale, scale);
        scene.add(object);

        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load('./assets/textura.jpg', (texture) => {
             // Aplique a textura ao material do objeto
            object.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    child.material.map = texture;
                }
            });
        });

        
        
        // Centralizar o objeto na cena
        const boundingBox = new THREE.Box3().setFromObject(object);
        const objectCenter = boundingBox.getCenter(new THREE.Vector3());
        object.position.sub(objectCenter);

        // Ajustar a posição da câmera para apontar para o objeto
        const cameraTarget = new THREE.Vector3();
        cameraTarget.copy(objectCenter);

        // Ajustar a posição horizontal e vertical da câmera
        // const objectSize = boundingBox.getSize(new THREE.Vector3());
        
        const cameraDistance = Math.max(objectSize.x, objectSize.y) * 2; // Ajuste o multiplicador conforme necessário
        camera.position.x = objectCenter.x;
        camera.position.y = objectCenter.y;
        camera.position.z = objectCenter.z + cameraDistance;
        
        
        camera.lookAt(object.position);
    }, (xhr) => {
        console.log(`Carregando objeto: ${(xhr.loaded / xhr.total) * 100}% carregados`);
    }, (err) => {
        console.log(`Aconteceu um erro: ${err}`);
    });
}, (xhr) => {
    console.log(`Carregando material: ${(xhr.loaded / xhr.total) * 100}% carregados`);
}, (err) => {
    console.log(`Aconteceu um erro no material: ${err}`);
});


const animate = function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
};
animate();