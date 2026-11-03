
/* =====================================================
   1. IMPORTACIONES
===================================================== */

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js';

import { FBXLoader } from 'https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/loaders/FBXLoader.js';


const track = document.querySelector(".carousel-track");
const slides = document.querySelectorAll(".carousel-slide");
const dots = document.querySelectorAll(".dot");

const nextBtn = document.querySelector(".next");
const prevBtn = document.querySelector(".prev");

let currentIndex = 0;

function updateCarousel() {

    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    dots.forEach((dot, index) => {
        dot.classList.toggle("active", index === currentIndex);
    });

}

nextBtn.addEventListener("click", () => {

    currentIndex++;

    if (currentIndex >= slides.length) {
        currentIndex = 0;
    }

    updateCarousel();

});

prevBtn.addEventListener("click", () => {

    currentIndex--;

    if (currentIndex < 0) {
        currentIndex = slides.length - 1;
    }

    updateCarousel();

});

dots.forEach((dot, index) => {

    dot.addEventListener("click", () => {
        currentIndex = index;
        updateCarousel();
    });

});

const panels = document.querySelectorAll(".mojojoy-panel");

panels.forEach(panel => {

    panel.addEventListener("click", () => {

        // Quitar selección anterior
        panels.forEach(item => {
            item.classList.remove("active");
        });

        // Activar el panel seleccionado
        panel.classList.add("active");

        // Identificar el modelo
        const modelo = panel.dataset.model;

        console.log("Modelo seleccionado:", modelo);

    });

});

const cards = document.querySelectorAll(".mojojoy-card");

const modal = document.getElementById("mojojoy-modal");

const closeModal = document.getElementById("close-modal");

cards.forEach(card => {

    card.addEventListener("dblclick", () => {

        const selectedModel = card.dataset.model;

        modal.classList.add("active");

        console.log("Modelo seleccionado:", selectedModel);

        // Aquí conectaremos la carga del modelo 3D.

    });

});

closeModal.addEventListener("click", () => {

    modal.classList.remove("active");

});

/* =====================================================
   2. VARIABLES DEL MODELO 3D
===================================================== */

let scene;
let camera;
let renderer;
let model;


/* =====================================================
   3. INICIALIZAR THREE.JS
===================================================== */

function iniciarModelo3D() {

    const canvas = document.querySelector('#model-canvas');

    // Comprobar que el canvas exista
    if (!canvas) {
        console.warn('No se encontró el canvas #model-canvas');
        return;
    }

    // Obtener dimensiones del canvas
    const width = canvas.clientWidth || 1;
    const height = canvas.clientHeight || 1;


    /* ---------- ESCENA ---------- */

    scene = new THREE.Scene();


    /* ---------- CÁMARA ---------- */

    camera = new THREE.PerspectiveCamera(
        35,
        width / height,
        0.1,
        100
    );

    camera.position.set(0, 0, 5);


    /* ---------- RENDERIZADOR ---------- */

    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });

    renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 2)
    );

    renderer.setSize(width, height, false);


    /* =================================================
       4. ILUMINACIÓN
    ================================================= */

    // Luz ambiental
    const ambientLight = new THREE.AmbientLight(
        0xffffff,
        2
    );

    scene.add(ambientLight);


    // Luz direccional
    const directionalLight = new THREE.DirectionalLight(
        0xffffff,
        3
    );

    directionalLight.position.set(3, 4, 5);

    scene.add(directionalLight);


    /* =================================================
       5. CARGAR MODELO 3D
    ================================================= */

    cargarModeloMojojoy();


    /* =================================================
       6. INICIAR ANIMACIÓN
    ================================================= */

    animarModelo();


    /* =================================================
       7. ADAPTAR TAMAÑO DEL CANVAS
    ================================================= */

    observarTamañoCanvas(canvas);
}


/* =====================================================
   8. FUNCIÓN PARA CARGAR EL MOJOJOY
===================================================== */

function cargarModeloMojojoy() {

    const loaderMojo = new FBXLoader();

    loaderMojo.load(

        './modelos/modelo_1mojojoy.fbx',

        // Cuando el modelo se carga correctamente
        function (object) {

            model = object;

            // Escala del modelo
            model.scale.set(1, 1, 1);


            // Centrar el modelo
            const box = new THREE.Box3().setFromObject(model);

            const center = box.getCenter(
                new THREE.Vector3()
            );

            model.position.sub(center);


            // Agregar modelo a la escena
            scene.add(model);

            console.log('Mojojoy cargado correctamente');
        },


        // Progreso de carga
        undefined,


        // Error al cargar
        function (error) {

            console.error(
                'Error cargando el modelo:',
                error
            );
        }
    );
}


/* =====================================================
   9. ANIMACIÓN DEL MODELO 3D
===================================================== */

function animarModelo() {

    requestAnimationFrame(animarModelo);

    // Rotar el modelo si ya está cargado
    if (model) {
        model.rotation.y += 0.005;
    }

    renderer.render(scene, camera);
}


/* =====================================================
   10. REDIMENSIONAR CANVAS
===================================================== */

function ajustarCanvas() {

    if (!renderer || !camera) return;

    const canvas = renderer.domElement;

    const width = canvas.clientWidth || 1;
    const height = canvas.clientHeight || 1;

    camera.aspect = width / height;

    camera.updateProjectionMatrix();

    renderer.setSize(width, height, false);
}


function observarTamañoCanvas(canvas) {

    // Detectar cambios de tamaño del contenedor
    if ('ResizeObserver' in window) {

        const observer = new ResizeObserver(() => {
            ajustarCanvas();
        });

        observer.observe(canvas.parentElement || canvas);

    } else {

        // Alternativa para navegadores sin ResizeObserver
        window.addEventListener('resize', ajustarCanvas);
    }
}


/* =====================================================
   11. MENÚ RESPONSIVE
===================================================== */

function configurarMenu() {

    const toggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.main-nav');

    if (!toggle || !nav) return;


    // Abrir y cerrar menú
    toggle.addEventListener('click', () => {

        const open = nav.classList.toggle('open');

        toggle.setAttribute('aria-expanded', String(open));

        toggle.setAttribute(
            'aria-label',
            open ? 'Cerrar menú' : 'Abrir menú'
        );

        toggle.textContent = open ? '×' : '☰';
    });


    // Cerrar menú al seleccionar una sección
    nav.querySelectorAll('a').forEach(link => {

        link.addEventListener('click', () => {

            nav.classList.remove('open');

            toggle.setAttribute('aria-expanded', 'false');

            toggle.setAttribute('aria-label', 'Abrir menú');

            toggle.textContent = '☰';
        });
    });
}


/* =====================================================
   12. ANIMACIONES DE ENTRADA
===================================================== */

function configurarAnimacionesEntrada() {

    const reducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
    ).matches;

    // Respetar la preferencia de movimiento reducido
    if (reducedMotion) return;

    // Comprobar disponibilidad de IntersectionObserver
    if (!('IntersectionObserver' in window)) return;


    const observer = new IntersectionObserver(

        entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add('is-visible');

                    observer.unobserve(entry.target);
                }
            });
        },

        {
            threshold: 0.12
        }
    );


    // Elementos que tendrán animación de entrada
    const elementos = document.querySelectorAll(
        '.intro-grid, .territory-card, .mojojoy-grid, .explore-card, .sources-grid'
    );


    elementos.forEach(elemento => {

        elemento.classList.add('will-reveal');

        observer.observe(elemento);
    });
}


/* =====================================================
   13. INICIAR TODAS LAS FUNCIONES
===================================================== */

function iniciarPagina() {

    iniciarModelo3D();

    configurarMenu();

    configurarAnimacionesEntrada();
}


// Ejecutar cuando el HTML esté disponible
if (document.readyState === 'loading') {

    document.addEventListener('DOMContentLoaded', iniciarPagina);

} else {

    iniciarPagina();
}
/*

import * as THREE from 'three';
import './style.css';

import { crearEscena1 } from './scenes/escena1.js';
import { crearEscena2 } from './scenes/escena2.js';
import { crearEscena3 } from './scenes/escena3.js';
import { crearEscena4 } from './scenes/escena4.js';
import { crearEscena5 } from './scenes/escena5.js';

// Configuración de las cinco escenas
const configuraciones = [
    { id: 'escena1', panel: 'panel1', crear: crearEscena1 },
    { id: 'escena2', panel: 'panel2', crear: crearEscena2 },
    { id: 'escena3', panel: 'panel3', crear: crearEscena3 },
    { id: 'escena4', panel: 'panel4', crear: crearEscena4 },
    { id: 'escena5', panel: 'panel5', crear: crearEscena5 }
];

const instancias = [];

let escenaActiva = null;
let ultimoTiempo = 0;
let animacionId = null;

// Crear cada escena y su renderizador independiente
configuraciones.forEach(config => {

    const contenedor = document.getElementById(config.id);
    const panel = document.getElementById(config.panel);

    const { scene, camera, update } = config.crear();

    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false
    });

    renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 1.5)
    );

    renderer.outputColorSpace = THREE.SRGBColorSpace;

    contenedor.appendChild(renderer.domElement);

    const instancia = {
        contenedor,
        panel,
        scene,
        camera,
        renderer,
        update
    };

    instancias.push(instancia);

    // Ajustar cámara y renderizador al tamaño del panel
    function redimensionar() {

        const width = contenedor.clientWidth;
        const height = contenedor.clientHeight;

        if (!width || !height) return;

        renderer.setSize(width, height, false);

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.render(scene, camera);
    }

    const observer = new ResizeObserver(redimensionar);
    observer.observe(contenedor);

    redimensionar();

    // Detectar entrada del mouse
    panel.addEventListener('pointerenter', () => {
        activarEscena(instancia);
    });

    // Detectar salida del mouse
    panel.addEventListener('pointerleave', () => {
        desactivarEscena(instancia);
    });

});

// Activar escena seleccionada
function activarEscena(instancia) {

    detenerAnimacion();

    instancias.forEach(item => {
        item.panel.classList.remove('activo');
    });

    instancia.panel.classList.add('activo');

    escenaActiva = instancia;

    ultimoTiempo = 0;

    animar();
}

// Detener una escena
function desactivarEscena(instancia) {

    if (escenaActiva !== instancia) return;

    detenerAnimacion();

    instancia.panel.classList.remove('activo');

    escenaActiva = null;

    // Renderizar una última vez
    instancia.renderer.render(
        instancia.scene,
        instancia.camera
    );
}

// Bucle de animación
function animar(tiempo) {

    if (!escenaActiva) return;

    animacionId = requestAnimationFrame(animar);

    if (!ultimoTiempo) {
        ultimoTiempo = tiempo;
    }

    const delta = Math.min(
        (tiempo - ultimoTiempo) / 1000,
        0.05
    );

    ultimoTiempo = tiempo;

    escenaActiva.update(delta);

    escenaActiva.renderer.render(
        escenaActiva.scene,
        escenaActiva.camera
    );
}

// Cancelar animación anterior
function detenerAnimacion() {

    if (animacionId !== null) {
        cancelAnimationFrame(animacionId);
        animacionId = null;
    }

}

*/