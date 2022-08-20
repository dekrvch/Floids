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
    signature.parentNode.insertBefore(container, signature);


    container.style.position = "relative";
    container.style.height = window.innerHeight+"px";
    container.style.borderTop = "5px solid red";


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