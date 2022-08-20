import {WebGLRenderer} from 'three';
const setSize = (container, camera, renderer) => {    
    // let signature = document.getElementById("signature");
    // signature.parentElement.insertBefore(container, signature);
    // container.style.position = "relative";
    // container.style.height = window.innerHeight + "px";
    // console.log(container.style);

    // camera.setViewOffset(container.clientWidth , container.clientHeight,
    //     -0.19*container.clientWidth, 0, container.clientWidth , container.clientHeight);

    let text = document.getElementById("text");
    text.style.width = "95%";

    let signature = document.getElementById("signature");
    signature.style.width = "95%";
    signature.parentNode.insertBefore(container, signature);

    container.style.position = "relative";
    container.style.width = 0.85*window.innerWidth+"px";
    container.style.height = 0.85*window.innerHeight+"px";
    container.style.margin = 0.075*window.innerHeight+"px";
    // container.style.left = 0.075*window.innerHeight+"px";
    // container.style.bottom = 0.075*window.innerHeight+"px";
    container.style.border = "2px solid #6f6a8e";


    camera.setViewOffset(container.clientWidth , container.clientHeight,
        0, 0, container.clientWidth , container.clientHeight);
    camera.position.set(0, 0, 3);
    

    camera.aspect = container.clientWidth / container.clientHeight;
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