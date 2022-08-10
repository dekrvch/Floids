const {Vector3} = require("three");

let cells;
let n, nn, nnn;
let cellSize;
let cellNeighbors;
let filledCells;

let quickVec1 = new Vector3();
let quickVec2 = new Vector3();

class UnitGrid {
    // Initialize the variables
    constructor() {
        cells = [];
        cellNeighbors = [];
        cellSize = null;
        filledCells = new Set;
    }
    // (Re)build the grid
    rebuild(partition){
        n = partition;
        nn = n * n;
        nnn = nn * n;
        cellSize = 2/n;
        cellNeighbors[nnn] = [nnn];
        for (let idx = 0; idx < nnn; idx++){
            cellNeighbors[idx] = this.findNeighboringCells(...this.unhash(idx));
            if (cellNeighbors[idx].includes(nnn)){
                cellNeighbors[nnn].push(idx);
            }
        }
    }
    resetCells(){
        for (let idx = 0; idx <= nnn; idx++) {
            cells[idx] = [];
        }
        filledCells.clear();
    }
    place(posArray){
        this.resetCells();
        for (let ID = 0; ID < posArray.length/3; ID++){
            let [x, y, z] = posArray.slice(ID*3, (ID+1)*3);
            let [i, j, k] = this.findCell(x, y, z);
            let idx = this.hash(i, j, k);
            cells[idx].push(ID);
            filledCells.add(idx);
        }
    }
    getDistancesSq(posArray, threshold, useGrid = true){
        if (useGrid){
            return this.gridSearch(posArray, threshold);
        }
        return this.bruteSearch(posArray, threshold);
    }
    gridSearch(posArray, threshold){
        this.resetCells();
        let optimalPartition = Math.floor(2/threshold);
        if (n!==optimalPartition){
            this.rebuild(optimalPartition);
        }
        this.place(posArray);

        let thresholdSq = threshold*threshold;
        let neighbors = [];
        for (let ID = 0; ID < posArray.length/3; ID++){
            neighbors[ID] = new Map();
        }
        for (let cell of filledCells){
            let gridNeighbors = cellNeighbors[cell].flatMap(_ => cells[_]);
            for (let ID1 of cells[cell]){
                for (let ID2 of gridNeighbors.filter(_ => _ > ID1)){
                    quickVec1.fromArray(posArray, ID1*3);
                    quickVec2.fromArray(posArray, ID2*3);
                    let distSq = quickVec1.addScaledVector(quickVec2, -1).lengthSq();
                    if (distSq < thresholdSq){
                        neighbors[ID1].set(ID2, distSq);
                        neighbors[ID2].set(ID1, distSq);
                    }
                }
            }
        }
        return neighbors;
    }
    bruteSearch(posArray, threshold){
        let thresholdSq = threshold*threshold;
        let neighbors = [];
        for (let ID1 = 0; ID1 < posArray.length/3; ID1++){
            neighbors[ID1] = new Map();
            for (let ID2 = 0; ID2 < posArray.length/3; ID2++){
                if (ID1!==ID2){
                    quickVec1.fromArray(posArray, ID1*3);
                    quickVec2.fromArray(posArray, ID2*3);
                    let distSq = quickVec1.addScaledVector(quickVec2, -1).lengthSq();
                    if (distSq < thresholdSq){
                        neighbors[ID1].set(ID2, distSq);
                    }
                }
            }
        }
        return neighbors;
    }
    findNear(pos, posArray, threshold){
        let thresholdSq = threshold*threshold;
        let near = new Map();
        let window = Math.ceil(threshold/cellSize);
        let [x, y, z] = [pos.x, pos.y, pos.z];
        let potentialNeighbors = []
        if (filledCells.size !== 0){
            let neighboringCells = this.findNeighboringCells(...this.findCell(x, y, z), window);
            potentialNeighbors = neighboringCells.flatMap(_ => cells[_]);
        }
        else {
            potentialNeighbors = [...Array(posArray.length/3).keys()];
        }
        for (let ID of potentialNeighbors){
            quickVec1.fromArray(posArray, ID*3);
            let distSq = quickVec1.addScaledVector(pos, -1).lengthSq();
            if (distSq < thresholdSq){
                near.set(ID, distSq);
            }
        }
        return near;
    }
    compare(posArray, threshold){
        const eqSet = (xs, ys) =>
            xs.size === ys.size &&
            [...xs].every((x) => ys.has(x));

        function toPairs(neighbors){
            let set = new Set();
            for (let ID1 = 0; ID1 < posArray.length/3; ID1++){
                let thisNeighbors = neighbors[ID1].keys();
                for (let ID2 of thisNeighbors){
                    set.add(`${ID1}-${ID2}`);
                }
            }
            return set;
        }
        let bruteNeighbors = this.getSqDistances(posArray, threshold, false);
        let gridNeighbors = this.getSqDistances(posArray, threshold, true);
        let bruteSet = toPairs(bruteNeighbors);
        let gridSet = toPairs(gridNeighbors);
        if (!eqSet(bruteSet, gridSet)){
            console.log("Do not match");
            console.log(bruteSet);
            console.log(gridSet);
        }
    }
    // Returns i, j, k, assuming the grid spans from -1 to +1
    findCell(x, y, z) {
        return [Math.floor((x + 1) / cellSize),
            Math.floor((y + 1) / cellSize),
            Math.floor((z + 1) / cellSize)];
    }
    hash(i, j, k) {
        if (i < 0 || i >= n ||
            j < 0 || j >= n ||
            k < 0 || k >= n) {
            return nnn;
        }
        return i + j * n + k * nn;
    }
    unhash(idx){
        return [idx%n,
                Math.floor(idx/n) - n*Math.floor(idx/nn),
                Math.floor(idx/nn)];
    }
    findNeighboringCells(i, j, k, window = 1){
        let neighbors = [];
        for (let l = i - window; l <= i + window; l++){
            for (let m = j - window; m <= j + window; m++){
                for (let n = k - window; n <=  k + window; n++){
                    neighbors.push(this.hash(l, m, n));
                }
            }
        }
        neighbors =  [...new Set(neighbors)];
        return neighbors;
    }
}

//let g = new UnitGrid();
//g.rebuild(20);
//console.log(g.findNeighboringCells(...g.unhash(601)).length);
//let neighbors = g.getNeighbors(posArray, 1, 0.5);



export {UnitGrid};