import './style.css'
import {World} from "./World/World.js";



function main(){
    const sceneContainer = document.querySelector("#scene-container");
    const world = new World(sceneContainer);
    world.start();
    const rotateMessage = document.getElementById("rotateMessage");
    rotateMessage.onclick = _ => {rotateMessage.style.visibility = "hidden"};
}

main();