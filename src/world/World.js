import {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    Color,
    Clock,
    Vector2,
    Vector3,
    TextureLoader,
    WebGLRenderTarget,
    LinearFilter,
    RGBAFormat,
    sRGBEncoding,
    Fog,
    PlaneBufferGeometry,
    PlaneGeometry,
    MeshBasicMaterial, Mesh
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Resizer } from "./Resizer";
import Stats from 'stats.js';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

import * as dat from 'dat.gui'
const gui = new dat.GUI();
gui.domElement.id = "gui";

import { Agents } from './Agents';
import { Hunter } from './Hunter';

let scene, camera, renderer;
let composer;


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
        camera.position.set(0, 0, 2.2);

        // Renderer
        renderer = new WebGLRenderer({ antialias: true,  alpha: true });

        container.append(renderer.domElement);
        // Orbit Controls
        const controls = new OrbitControls(camera, container)
        controls.enableDamping = true
        controls.dampingFactor = 0.001;
        controls.enableZoom = true;
        controls.enablePan = false;
        controls.quickVec = new Vector3;
        let yAxis = new Vector3(0, 1, 0);
        controls.tick = () => {
            controls.update();
        }
        updatables.push(controls);
        // Clock
        clock = new Clock;
        // FPS meter
        stats = new Stats();

        stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
        container.appendChild(stats.domElement);
        stats.domElement.id = "stats";

        // Resizer
        const resizer = new Resizer(container, camera, renderer);

        // Objects
        let agents = new Agents(700);
        window.addEventListener("resize", _ => {    agents.uniforms.aspect.value = resizer.aspect   });
        let hunter = new Hunter();
        agents.setHunter(hunter);
        updatables.push(agents, hunter);
        scene.add(agents.mesh, hunter.mesh);

        //Bloom pass
        const renderScene = new RenderPass( scene, camera );
        const bloomPass = new UnrealBloomPass(new Vector2( window.innerWidth, window.innerHeight ), 0.6, 0.7, 0.8 );
        composer = new EffectComposer( renderer );
        composer.addPass( renderScene );
        composer.addPass( bloomPass );
        
        // GUI
        const firingFolder = gui.addFolder('Firing')
        firingFolder.add(agents, 'FIRE_CYCLE', 0.5, 5).step(0.1).name("Cycle");
        firingFolder.add(agents, 'NUDGE_FACTOR', 0, 0.03).step(0.003).name("Nudging");
        firingFolder.add(agents.uniforms.fireR2, 'value', 0, 0.004).step(0.0005).name("Body fire");
        firingFolder.add(agents.uniforms.fireR1, 'value', 0, 0.04).step(0.005).name("Diffused fire");
        const desyncButton = { desync:function(){  agents.desyncronize(); }};
        firingFolder.add(desyncButton,'desync').name("Desyncronize");
        const flockingFolder = gui.addFolder('Flocking')
        flockingFolder.add(agents, 'DESIRED_SPEED', 0, 0.4).step(0.05).name("Speed");
        flockingFolder.add(agents, 'COHERE_FACTOR', 0, 10).step(0.1).name("Coherence");
        flockingFolder.add(agents, 'ALIGN_FACTOR', 0, 0.2).step(0.01).name("Alignment");
        flockingFolder.add(agents, 'AVOID_FACTOR', 0, 50).step(1).name("Avoidance");
        //flockingFolder.add(agents, 'USE_GRID').name("Use grid");
        const hunterFolder = gui.addFolder('Hunter')
        hunterFolder.add(hunter, 'enable').name("Enable");
        hunterFolder.add(hunter, 'CHASE_FACTOR', 0, 0.8).step(0.1).name("Chasing");
        hunterFolder.add(agents, 'FLEE_FACTOR', 0, 10).step(0.1).name("Fleeing");
        hunterFolder.add(agents, 'CONFUSION_FACTOR', 0, 0.5).step(0.005).name("Confusion");
    }

    start(){
        renderer.setAnimationLoop(_ => {
            this.tick();
            //renderer.render(scene, camera);
            composer.render();
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