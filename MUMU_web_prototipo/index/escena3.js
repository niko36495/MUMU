
import * as THREE from 'three';

export function crearEscena3() {

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#080d20');

    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
    camera.position.z = 5;

    const geometry = new THREE.IcosahedronGeometry(1.1, 1);

    const material = new THREE.MeshStandardMaterial({
        color: '#8055d9',
        wireframe: true
    });

    const objeto = new THREE.Mesh(geometry, material);
    scene.add(objeto);

    const light = new THREE.PointLight('#ffffff', 30);
    light.position.set(3, 3, 4);
    scene.add(light);

    return {
        scene,
        camera,

        update(delta) {
            objeto.rotation.x += delta * 0.4;
            objeto.rotation.y += delta * 0.7;
        }
    };
}
