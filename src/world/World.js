import {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    Color,
    Clock,
    Vector2,
    Vector3,
    TextureLoader,
    LinearToneMapping,
    ReinhardToneMapping,
    ACESFilmicToneMapping,
    CineonToneMapping,
    NoToneMapping,
    CustomToneMapping,
    Fog,
    PlaneBufferGeometry,
    PlaneGeometry,
    MeshBasicMaterial, Mesh
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Resizer } from "./Resizer";
import Stats from 'stats.js';

import * as dat from 'dat.gui'
const gui = new dat.GUI()

import { Agents } from './Agents';
import { Hunter } from './Hunter';

let scene, camera, renderer;

let updatables;
let clock, stats;

class World{
    constructor(container) {
        updatables = [];

        // Scene
        scene = new Scene();
        const loader = new TextureLoader();
        let backgroundTexture = loader.load('https://raw.githubusercontent.com/dekrvch/Floids/main/src/assets/background.svg');
        scene.background = backgroundTexture;
        // Camera
        camera = new PerspectiveCamera(
            50, // fov = Field Of View
            1, // aspect ratio (dummy value)
            0.1, // near clipping plane
            100, // far clipping plane
        );
        camera.position.set(0, 0, 2.5);
        camera.setViewOffset(window.innerWidth , window.innerHeight,
            -0.15*window.innerWidth, 0, window.innerWidth , window.innerHeight)

        // Renderer
        renderer = new WebGLRenderer({ antialias: true});

        container.append(renderer.domElement);
        // Orbit Controls
        const controls = new OrbitControls(camera, container)
        controls.enableDamping = true
        controls.dampingFactor = 0.002;
        controls.enableZoom = true;
        controls.enablePan = false;
        controls.quickVec = new Vector3;
        let yAxis = new Vector3(0, 1, 0);
        controls.tick = () => {
            controls.update();
        }
        updatables.push(controls);
        // Resizer
        const resizer = new Resizer(container, camera, renderer);
        // Clock
        clock = new Clock;
        // FPS meter
        stats = new Stats();
        stats.dom.style.left = null;
        stats.dom.style.right = 0;
        stats.dom.style.top = null;
        stats.dom.style.bottom = 0;
        stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
        container.appendChild(stats.domElement);

        // Objects
        let agents = new Agents(700);
        let hunter = new Hunter();
        agents.setHunter(hunter);
        updatables.push(agents, hunter);
        scene.add(agents.mesh, hunter.mesh);
        // GUI
        const firingFolder = gui.addFolder('Firing')
        firingFolder.add(agents, 'FIRE_CYCLE', 0.5, 5).step(0.1).name("Cycle");
        firingFolder.add(agents, 'NUDGE_FACTOR', 0, 0.1).step(0.001).name("Nudging");
        firingFolder.add(agents.uniforms.fireR2, 'value', 0, 0.01).step(0.001).name("Body light");
        firingFolder.add(agents.uniforms.fireR1, 'value', 0, 0.05).step(0.002).name("Diffused light");
        const flockingFolder = gui.addFolder('Flocking')
        flockingFolder.add(agents, 'DESIRED_SPEED', 0, 0.3).step(0.05).name("Speed");
        flockingFolder.add(agents, 'ALIGN_FACTOR', 0, 0.2).step(0.01).name("Alignment");
        flockingFolder.add(agents, 'COHERE_FACTOR', 0, 10).step(0.1).name("Coherence");
        flockingFolder.add(agents, 'AVOID_FACTOR', 0, 50).step(1).name("Avoidance");
        //flockingFolder.add(agents, 'USE_GRID').name("Use grid");
        const hunterFolder = gui.addFolder('Hunter')
        hunterFolder.add(hunter, 'enable').name("Enable");
        hunterFolder.add(hunter, 'CHASE_FACTOR', 0, 0.8).step(0.1).name("Chasing");
        hunterFolder.add(agents, 'FLEE_FACTOR', 0, 10).step(0.1).name("Fleeing");
        hunterFolder.add(agents, 'CONFUSION_FACTOR', 0, 0.1).step(0.005).name("Confusion");
    }

    start(){
        renderer.setAnimationLoop(_ => {
            this.tick();
            renderer.render(scene, camera);
            stats.update();
        })
    }
    stop(){
        renderer.setAnimationLoop(null);
    }
    tick(){
        let delta = Math.min(clock.getDelta(), 0.05); //to prevent huge delta value after swithcing the tab
        let elapsed = clock.getElapsedTime();
        for (let object of updatables){
            object.tick(delta, elapsed);
        }
    }
}

export {World}