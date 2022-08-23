import {WebGLRenderer} from 'three';
const setSize = (container, camera, renderer) => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.setViewOffset(container.clientWidth , container.clientHeight,
        (camera.aspect > 1) ? -0.2*container.clientWidth : 0, // center if portrait, shift to the right if landscape
        0, container.clientWidth , container.clientHeight);
    camera.position.set(0, 0, (camera.aspect > 1) ? 2.8 : 3.5); // zoom depending on the orientation
    camera.updateProjectionMatrix(); // update the camera's frustum
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);

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