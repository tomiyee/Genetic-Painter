const WIDTH = W = 160;
const HEIGHT = H = 160;
const MAX_VERTICES = 4;
const MIN_VERTICES = 3;
const MAX_VERTEX_SHIFT = W < H ? W / 50 : H / 50;
const MIN_VERTEX_SHIFT = 1;
const MAX_COLOR_SHIFT = 30;
const MIN_COLOR_SHIFT = 1;
const POPULATION_SIZE = 100;
const DECAY_RATE = 7/10; // closer to 1, more likely that the less fit members are chosen for breeding
const SHOW_RATINGS = false;

let mutationRate = 1/150;

let canvas;
let ctx;
let targetImage;
let numGenes = 200;
let geneIncrement;
let population;
let stop = false;
let generation = 0;

window.onload = start;

function start () {
  // set up the canvas
  canvas = document.getElementById('game');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  // gets the context of the canvas
  ctx = canvas.getContext('2d');
  targetImage = kissy;

  geneIncrement = 0;
  population = new Population ();
}


function gen () {
  generation++;
  console.log("Generation: " + generation)
  population = new Population (population.painters, geneIncrement);
  population.showBest();
  console.log(population.getBest().evaluate());
  if(!stop)
    setTimeout(gen,10);

}


/**
 * Subtracts two arrays from each other like Python
 * @param {Number[]} arr1 - A one dimensional array
 * @param {Number[]} arr2 - Another one dimensional array
 * @returns {Number[]} The result of (arr1 - arr2) ** 2
 */
function squareError (arr1, arr2) {
  if(arr1.length != arr2.length)
    return console.error('cannot subtract arrays of unequal length');
  let res = new Array(arr1.length);
  for(let i = 0; i < arr1.length; i++)
    res[i] = Math.pow(arr1[i] - arr2[i], 2);
  return res;
}



/**
 * Averages all the values in the array
 * @param {Number[]} arr - A one dimensional array of numbers
 * @param {Boolean} abs - (opt, def false) Whether to average only positive values in arr
 * @returns {Number} The average of the arr
 */
function averArr(arr, abs) {
  let sum = 0;
  for(let i = 0; i < arr.length; i++)
    if(abs)
      sum += Math.abs(arr[i]);
    else
      sum += arr[i];
  let aver = sum / arr.length;
  return aver;
}



/**
 * Calculates the MSE of the image

 */
function calcError (cd) {
  let errors = squareError(targetImage, cd);
  let rmse = averArr(errors, true);
  return Math.sqrt(rmse);
}



/**
 * Draws a rectangle onto the global ctx variable
 * @param {Number} x - The x coordinate
 * @param {Number} y - The y coordinate
 * @param {Number} w - The width of the rectangle
 * @param {Number} h - The height of the rectangle
 * @param {String} c - The color of the rectangle
 */
function drawRectangle(x, y, w, h, c) {
  ctx.fillStyle = c;
  ctx.fillRect(x, y, w, h);
}



/**
 * Draws an image onto the canvas
 * @param {String} src - The image source
 * @param {Number} x - The x coordinate of the top right of the image
 * @param {Number} y - The y coordinate of the top right of the image
 * @param {Number} w - The width of the image
 * @param {Number} h - The height of the image
 * @param {function} callback - The callback, to be run after the image is drawn
 */
function drawImage (src, x, y, w, h, callback) {
  var image = new Image();
  image.onload = function () {
    ctx.drawImage(this, x, y, w, h);
    if(callback)
      callback();
  }
  image.src = src;
}



class Population {

  /**
   * If given no paramaters, will generate completely random organisms,
   * Otherwise th
   * @param {Population} prevPop - The previous pupulation
   */
  constructor (prevPop, increment) {
    this.painters = [];
    if(prevPop) {
      this.painters = prevPop;
      // sorts the previous population by fitness, first being most fit
      let sorted = this.sortPopulation();
      // a list of lists of genes, each row being a child
      let childrensGenes = [];
      for(let kid = 0; kid < POPULATION_SIZE; kid++) {
        let num1 = Math.random();
        let parent1;
        for(let i = 1; i <= POPULATION_SIZE; i++) {
          if(num1 > Math.pow(DECAY_RATE, i)) {
            parent1 = sorted[i - 1].painter;
            break
          }
        }
        let num2 = Math.random();
        let parent2;
        for(let i = 1; i <= POPULATION_SIZE; i++) {
          if(num2 > Math.pow(DECAY_RATE, i)) {
            parent2 = sorted[i - 1].painter;
            break
          }
        }
        // let the parents breed
        let genes = parent1.breed(parent2);
        childrensGenes.push(genes);
      }

      numGenes += increment || 0;
      this.painters = [];
      for(let i = 0; i < childrensGenes.length; i++) {
        this.painters.push(new Painter(childrensGenes[i]));
      }
      this.sortPopulation();
    }
    else{
      for(let i = 0; i < POPULATION_SIZE; i++)
        this.painters.push( new Painter() );
      this.sortPopulation();
    }
  }



  showBest () {
    this.painters[0].exhibit();
  }



  getBest () {
    return this.painters[0];
  }



  getWorst () {
    return this.painters[this.painters.length - 1];
  }


  getMedian () {
    return this.painters[Math.round(this.painters.length / 2)];
  }



  /**
   * Sorts the list of painters by the fitness
   * @returns {Painter[]} The result of sorting this population
   */
  sortPopulation () {
    let sorted = [];
    let members = this.painters;
    for(let i = 0; i < this.painters.length; i++) {
      // gets the suck scale
      let rmse = this.painters[i].evaluate();
      let data = {painter: members[i], fitness: 1/rmse};
      if(sorted.length == 0) {
        sorted.push(data);
        continue;
      }
      // sort
      for(var si = 0; si < sorted.length; si++) {
        if(rmse < 1/sorted[si].fitness){
          sorted.splice(si, 0, data);
          break;
        }
      }
      if(si == sorted.length)
        sorted.push(data);
    }
    // separate painters from evaluations
    let painters = [];
    for(let p in sorted)
      painters.push(sorted[p].painter);
    // painters
    this.painters = painters;
    this.sorted = sorted;
    return sorted;

  }


}
