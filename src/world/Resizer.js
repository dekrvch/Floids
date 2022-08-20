import {WebGLRenderer} from 'three';

let edgeMargin = 10;
let portraitBreak = 50;

const toPortrait = (text, signature, gui, stats, hr) => {
    text.style.width = "90%";

    signature.style.width = "98%";
    signature.style.marginTop = window.innerHeight+portraitBreak - 65  +"px";

    signature.parentNode.insertBefore(gui, signature);
    gui.style.position = "relative";
    gui.style.float = "left";
    gui.style.marginTop = portraitBreak+"px";
    gui.style.marginLeft = 0+"px";

    signature.parentNode.insertBefore(stats, signature);
    stats.style.float = "right";
    stats.style.position = "relative";
    stats.style.marginTop = portraitBreak+"px";
    stats.style.marginRight = 0+"px";

    hr.style.visibility = "visible";
} 

const toLandscape = (text, signature, gui, stats, hr) => {
    text.style.width = "40%";

    signature.style.width = "40%";
    signature.style.marginTop = 0  +"px";

    document.body.appendChild(gui);
    gui.style.position = "fixed";
    gui.style.float = "right";
    gui.style.top = 0+"px";
    gui.style.right = 0+"px";

    document.body.appendChild(stats);
    stats.style.position = "fixed";
    stats.style.top = null;
    stats.style.left = null;
    stats.style.bottom = 0+"px";
    stats.style.right = 0+"px";

    hr.style.visibility = "hidden";
} 

const setSize = (container, camera, renderer) => {
    let landscape = (window.innerWidth > window.innerHeight);
    let text = document.getElementById("text");
    let signature = document.getElementById("signature");
    let gui = document.getElementsByClassName("dg ac").item(0);
    let stats = document.getElementById("stats");
    let hr = document.getElementById("hr");

    (landscape) ? toLandscape(text, signature, gui, stats, hr) : 
    toPortrait(text, signature, gui, stats, hr);
    
    camera.setViewOffset(window.innerWidth , window.innerHeight,
        landscape? -0.19*window.innerWidth : 0,
        0, window.innerWidth , window.innerHeight)

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