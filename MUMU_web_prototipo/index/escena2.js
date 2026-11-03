
import * as THREE from 'three';

export function crearEscena2() {

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#21152d');

    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
    camera.position.z = 4;

    const geometry = new THREE.TorusKnotGeometry(
        0.9, 0.3, 150, 20
    );

    const material = new THREE.MeshStandardMaterial({
        color: '#c14617',
        metalness: 0.7,
        roughness: 0.25
    });

    const objeto = new THREE.Mesh(geometry, material);
    scene.add(objeto);

    const light = new THREE.PointLight('#ffffff', 35);
    light.position.set(2, 3, 4);
    scene.add(light);

    scene.add(new THREE.AmbientLight('#ffffff', 1));

    return {
        scene,
        camera,

        update(delta) {
            objeto.rotation.x += delta * 0.6;
            objeto.rotation.y += delta * 0.8;
        }
    };
}
