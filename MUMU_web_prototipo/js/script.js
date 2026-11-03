import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';

// 1. Obtener el canvas
const canvas = document.querySelector('#model-canvas');

// 2. Crear la escena
const scene = new THREE.Scene();

// 3. Crear la cámara
const camera = new THREE.PerspectiveCamera(
    35,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    100
);

camera.position.set(0, 0, 5);

// 4. Crear el renderizador
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
});

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(canvas.clientWidth, canvas.clientHeight);

// 5. Iluminación
const ambientLight = new THREE.AmbientLight(0xffffff, 2);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
directionalLight.position.set(3, 4, 5);
scene.add(directionalLight);

// 6. Cargar modelo 3D
/*
const loader = new GLTFLoader();

let model;

loader.load(
    './modelos/modelo_1mojojoy.blend',

    function (gltf) {
        model = gltf.scene;

        model.scale.set(1, 1, 1);
        model.position.set(0, 0, 0);

        scene.add(model);
    },

    undefined,

    function (error) {
        console.error('Error cargando el modelo:', error);
    }
);
*/


const loader_mojo = new FBXLoader();

let model;

const container_mojo = document.getElementById('modelo_mojojoy');

loader_mojo.load(
    './modelos/modelo_1mojojoy.fbx',

    function (object) {

        model = object;

        model.scale.set(1, 1, 1);

        // Centrar modelo
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());

        model.position.sub(center);

        scene.add(model);

        console.log('Mojojoy cargado correctamente');
    },

    undefined,

    function (error) {
        console.error('Error cargando el modelo:', error);
    }
);


const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    toggle.textContent = open ? '×' : '☰';
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menú');
    toggle.textContent = '☰';
  }));
}
// Progressive reveal for supporting content; honors reduced-motion preferences.
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if ('IntersectionObserver' in window && !reducedMotion) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.intro-grid, .territory-card, .mojojoy-grid, .explore-card, .sources-grid').forEach(el => {
    el.classList.add('will-reveal');
    observer.observe(el);
  });
}

// 7. Animación
function animate() {
    requestAnimationFrame(animate);

    if (model) {
        model.rotation.y += 0.005;
    }

    renderer.render(scene, camera);
}

animate();

// 8. Adaptar el canvas al tamaño del contenedor
function resize() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
}

window.addEventListener('resize', resize);

