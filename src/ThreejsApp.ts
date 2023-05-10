import * as THREE from 'three';

export default class ThreejsApp {
	scene: THREE.Scene;
	renderer: THREE.WebGLRenderer;
	camera: THREE.PerspectiveCamera;
	ambientLight: THREE.AmbientLight;

	constructor() {
		this.scene = new THREE.Scene();
		this.scene.background = new THREE.Color('#444444');

		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild(this.renderer.domElement);

		this.camera = new THREE.PerspectiveCamera(
			75,
			window.innerWidth / window.innerHeight,
			0.1,
			1000
		);

		this.ambientLight = new THREE.AmbientLight(0xffffff, 1);
		this.scene.add(this.ambientLight);

		window.addEventListener('resize', this.onWindowResize, false);

		this.animate();
	}

	onWindowResize = () => {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
	};

	animate = () => {
		requestAnimationFrame(this.animate);
		this.renderer.render(this.scene, this.camera);
	};
}
