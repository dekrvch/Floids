import"./style.css";import{World}from"./World/World.js";function main(){const e=document.querySelector("#scene-container");new World(e).start();let t=e=>{let t=window.innerWidth/window.innerHeight<1;document.getElementById("textCheckBox").style.display=t?"":"none",document.getElementById("signature").style.marginBottom=t?"75pt":"10pt"};t(),window.addEventListener("resize",t)}main();