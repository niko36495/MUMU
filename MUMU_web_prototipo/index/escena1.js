
import * as THREE from 'three';

export function crearEscena1() {

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#10182c');

    const camera = new THREE.PerspectiveCamera(
        60, 1, 0.1, 100
    );

    camera.position.z = 4;

    // Planeta
    const geometry = new THREE.SphereGeometry(1, 64, 64);

    const material = new THREE.MeshStandardMaterial({
        color: '#2875c7',
        roughness: 0.8,
        metalness: 0.1
    });

    const planeta = new THREE.Mesh(geometry, material);
    scene.add(planeta);

    // Anillo
    const ringGeometry = new THREE.TorusGeometry(1.5, 0.025, 16, 100);

    const ringMaterial = new THREE.MeshBasicMaterial({
        color: '#79b933'
    });

    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = 1.2;

    scene.add(ring);

    // Iluminación
    const light = new THREE.PointLight('#ffffff', 30);
    light.position.set(3, 3, 4);
    scene.add(light);

    scene.add(new THREE.AmbientLight('#ffffff', 1));

    return {
        scene,
        camera,

        update(delta) {
            planeta.rotation.y += delta * 0.5;
            ring.rotation.z += delta * 0.2;
        }
    };
}
