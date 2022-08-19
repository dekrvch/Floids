import {Vector3} from "three";

function pointInSphere(radius=1){
    let vec3 = new Vector3();
    do {
        vec3.set(
            (Math.random()-0.5)*2,
            (Math.random()-0.5)*2,
            (Math.random()-0.5)*2)
    } while (vec3.lengthSq() > 1);
    return vec3.multiplyScalar(radius);
}

export {pointInSphere};