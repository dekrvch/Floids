import './style.css'
import {World} from "./World/World.js";



function main(){
    const sceneContainer = document.querySelector("#scene-container");
    const world = new World(sceneContainer);
    world.start();



}

main();