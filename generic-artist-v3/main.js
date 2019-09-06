const WIDTH = W = 160;
const HEIGHT = H = 160;
const MAX_VERTICES = 3;
const MIN_VERTICES = 3;
const MAX_VERTEX_SHIFT = 5;// W < H ? W / 20 : H / 20;
const MIN_VERTEX_SHIFT = 1;
const MAX_COLOR_SHIFT = 40;
const MIN_COLOR_SHIFT = 1;
const POPULATION_SIZE = 80;
const DECAY_RATE = 7/10; // closer to 1, more likely that the less fit members are chosen for breeding
const SHOW_RATINGS = false;
const MAX_DIST = W / 6;

// The range for the areas of the triangles that make up the genes
const MAX_SIDE_LENGTH = 30;
const MIN_SIDE_LENGTH = 20;

const RANDOMIZE_SHAPE_ALPHA = false;
// only applies if RANODMIZE_ALPHA is true
const MIN_ALPHA = 0.1;
const MAX_ALPHA = 0.9;
// only applies if RANDOMIZE_ALPHA is false
const ALPHA = 1;

let mutationRate = 1/50;

let s4Canvas;
let s4ctx;
let targetImage;
let numGenes = 100;
let geneIncrement;
let population;
let stopSlide4 = false;
let generation = 0;
let genPerIter = 1;

let currentSlide = 1;
let numSlides = 5;

let invisibleCanvas;

let s4BestCanvas, s4Bestctx;
let s4MedianCanvas, s4Medianctx;
let s4WorstCanvas, s4Worstctx;

window.onload = start;

function start () {
  // set up the canvas
  s4BestCanvas = document.getElementById('slide4BestCanvas');
    s4BestCanvas.width = WIDTH;
    s4BestCanvas.height = HEIGHT;

  s4MedianCanvas = document.getElementById('slide4MedianCanvas');
    s4MedianCanvas.width = WIDTH;
    s4MedianCanvas.height = HEIGHT;

  s4WorstCanvas = document.getElementById('slide4WorstCanvas');
    s4WorstCanvas.width = WIDTH;
    s4WorstCanvas.height = HEIGHT;

  invisibleCanvas = document.createElement('canvas');
    invisibleCanvas.width = W;
    invisibleCanvas.height = H;
    invisibleCanvas.style.display = 'none';

  // gets the context of the canvas
  s4Bestctx   = s4BestCanvas.getContext('2d');
  s4Medianctx = s4MedianCanvas.getContext('2d');
  s4Worstctx  = s4WorstCanvas.getContext('2d');

  targetImage = kissy;

  geneIncrement = 0;
  population = new Population ();

  // Add event handlers
  document.addEventListener("keydown",keyDownHandler);
}

/* ===================================================== */
/* =             Code For The Web Design               = */
/* ===================================================== */


let slideEnter = [() => {}, () => {}, () => {}, slide4_enter, () => {}];
let slideLeave = [() => {}, () => {}, () => {}, slide4_leave, () => {}];



/**
 * Transitions to the next slide
 */
function nextSlide () {
  if(currentSlide == slideEnter.length - 1)
    return;
  $(".slides").css("display", "none");
  slideLeave[currentSlide - 1] && slideLeave[currentSlide - 1]();
  currentSlide ++;
  $(`.slide-${currentSlide}`).css("display", "block");
  slideEnter[currentSlide - 1] && slideEnter[currentSlide - 1]();
}



/**
 * Transitions to the previous slide
 */
function backSlide () {
  if(currentSlide == 0)
    return;

  $(".slides").css("display", "none");
  slideLeave[currentSlide - 1]();
  currentSlide --;
  $(`.slide-${currentSlide}`).css("display", "block");
  slideEnter[currentSlide - 1]();
}



/**
 * The Key-Down Event Handler
 *
 * @param  {Object} e - The event data
 */
function keyDownHandler (e) {
  switch (e.keyCode) {
    case 37:
      if(currentSlide != 0)
        backSlide();
      break;
    case 39:
      if(currentSlide != numSlides)
        nextSlide();
      break;
    case 13:
        slide4Generation()
  }
}



/**
 * Function that runs once slide 4 is opened
 */
function slide4_enter () {
  stopSlide4 = false;
  slide4Demonstration();
}

function slide4_leave () {
  stopSlide4 = true;
}


/* ===================================================== */
/* =            Code For Genetic Algorithm             = */
/* ===================================================== */

function slide4Generation() {
  generation += genPerIter;
  console.log("Generation: " + generation);
  $(".slide-4-gen-num").text(generation);

  for(let i = 0; i < genPerIter; i++){
    p = population.painters
    population = new Population (p, geneIncrement);
  }

  population.showBest(s4BestCanvas);
  population.getMedian().exhibit(s4MedianCanvas);
  population.getWorst().exhibit(s4WorstCanvas);
}

function slide4Demonstration () {

  slide4Generation();
  // console.log(population.getBest().evaluate());
  if(!stopSlide4)
    setTimeout(slide4Demonstration,10);
}


function tweak(gene) {

  let pDist, nDist
  // tweaks the vertices
  for(let j = 0; j < gene.vertices.length; j++) {

    let v = gene.vertices[j];

    let prevV = j != 0 ? gene.vertices [j-1] : gene.vertices [gene.vertices.length-1];
    let nextV = j != gene.vertices.length-1 ? gene.vertices [j+1] : gene.vertices[0];

    do {
      v.x += (Math.random() < 0.5 ? -1 : 1) * (Math.random() * (MAX_VERTEX_SHIFT - MIN_VERTEX_SHIFT) + MIN_VERTEX_SHIFT);
      v.y += (Math.random() < 0.5 ? -1 : 1) * (Math.random() * (MAX_VERTEX_SHIFT - MIN_VERTEX_SHIFT) + MIN_VERTEX_SHIFT);
      if(v.x < 0)
        v.x = 0;
      else if(v.x > W)
        v.x = W;
      if(v.y < 0)
        v.y = 0;
      else if(v.y > H)
        v.y = H;
      pDist = prevV.distanceTo(v);
      nDist = nextV.distanceTo(v);
    } while (pDist > MAX_DIST || pDist < 5 || nDist > MAX_DIST || nDist < 5);

  }
}


/**
 * Generates a random real number between the the given bounds, inclusive
 * @param {Number} min - The minimum value
 * @param {Number} max - The maximum value
 * @returns {Number} A generated number on the range from [min, max]
 */
function random(min, max) {
  return Math.random() * (max-min) + min;
}



/**
 * Generates a random integer on the range [min, max]
 *
 * @param  {Number} min the minimum size integer inclusive
 * @param  {Number} max the maximum size integer inclusive
 * @return {Number}     The random number
 */
function randInt (min, max) {
  return Math.round(Math.random()*(max-min)) + min;
}



/**
 * Returns a random boolean with probability p of returning true
 * @param {Number} p - [0, 1] Probability of returning true
 * @returns {Boolean} A boolean
 */
function randomBoolean(p) {
  return Math.random() < p;
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
    // runs the callback function if one is given
    callback? callback : 0;
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

      // Breeds the next generation
      for(let kid = 0; kid < POPULATION_SIZE; kid++) {

        // Randomly select the first parent, favoring high fitness
        let num1 = Math.random();
        let parent1;
        for(let i = 1; i <= POPULATION_SIZE; i++) {
          if(num1 > Math.pow(DECAY_RATE, i)) {
            parent1 = sorted[i - 1].painter;
            break;
          }
        }

        // Randomly select the next parent, favoring high fitness
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
        // add the child's genes to a list of genes
        childrensGenes.push(genes);
      }

      numGenes += increment || 0;
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



  showBest (canvas) {
    this.painters[0].exhibit(canvas);
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

  getPainter (num) {
    return this.painters[Math.round(num)];
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
