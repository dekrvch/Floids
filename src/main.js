import './style.css'
import {World} from "./World/World.js";



function main(){
    const sceneContainer = document.querySelector("#scene-container");
    const world = new World(sceneContainer);
    world.start();
    let onRotation = _ =>
    {
        let portrait = (window.innerWidth / window.innerHeight) < 1;
        document.getElementById("textCheckBox").style.display   = portrait ? "": "none";  // hide text button when landscape
        document.getElementById("signature").style.marginBottom = portrait ? "75pt" : "10pt";
    };
    onRotation();
    window.addEventListener("resize", onRotation)
}

main();