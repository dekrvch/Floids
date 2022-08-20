import './style.css'
import {World} from "./World/World.js";



function main(){
    console.log(text.style);
    const sceneContainer = document.querySelector("#scene-container");
    const world = new World(sceneContainer);
    world.start();
}

main();