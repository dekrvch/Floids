const setSize = (container, camera, renderer) => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix(); // update the camera's frustum
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
}

class Resizer {
    constructor(container, camera, renderer) {
        setSize(container, camera, renderer);
        window.addEventListener("resize", _ => {
            setSize(container, camera, renderer);
        });
    }
}

export {Resizer};