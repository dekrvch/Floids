const setSize = (container, camera, renderer) => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix(); // update the camera's frustum
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
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