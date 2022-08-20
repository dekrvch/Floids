import {WebGLRenderer} from 'three';
const setSize = (container, camera, renderer) => {    
    camera.setViewOffset(window.innerWidth , window.innerHeight,
        -0.19*window.innerWidth, 0, window.innerWidth , window.innerHeight)

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix(); // update the camera's frustum
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    
}

let initialAspect

class Resizer {
    constructor(container, camera, renderer) {
        initialAspect = container.clientWidth / container.clientHeight;
        this.aspect = 1;
        setSize(container, camera, renderer);
        window.addEventListener("resize", _ => {
            setSize(container, camera, renderer);
            this.aspect = container.clientWidth / container.clientHeight / initialAspect;
        });
    }
}

export {Resizer};