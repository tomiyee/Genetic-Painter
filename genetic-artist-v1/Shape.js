

/**
 * @class A shape with at least three sides
 */
class Shape {

  constructor (arr) {
    this.isShape = true;
    this.vertices = arr || [];
    if(typeof arr == 'undefined')
      this.randomizeVertices();
    this.randomizeColor();
  }



  /**
   * Draws the shape onto the canvas
   */
  draw (context) {
    context = context || ctx;
    context.fillStyle = this.color;
    context.beginPath();
    context.moveTo(this.vertices[0].x, this.vertices[0].y);
    for(let i = 1; i < this.vertices.length; i++)
      context.lineTo(this.vertices[i].x, this.vertices[i].y);
    context.closePath();
    context.fill();
  }



  equals (other) {
    if(!other.hasOwnProperty('isShape') || !other.isShape)
      return false;
    if(this.vertices.length != other.vertices.length)
      return false;
    for(let i in this.vertices)
      if(!this.vertices[i].equals(other.vertices[i]))
        return false;
    if(this.color != other.color)
      return false;
    return true;
  }



  /**
   * Returns the vertices
   * @returns {Vector[]} The points
   */
  getVertices () {
    return this.vertices;
  }



  /**
   * Randimizes the color of the shape
   * @returns {Shape} This
   */
  randomizeColor () {
    let r = Math.floor(Math.random() * 255);
    let g = Math.floor(Math.random() * 255);
    let b = Math.floor(Math.random() * 255);
    let a = 1;

    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;

    this.color = `rgba(${r}, ${g}, ${b}, ${a})`;
    return this;
  }



  /**
   * Generates random vertices for the Shape
   * @returns {Shape} This
   */
  randomizeVertices () {
    // empties the existing vertices
    this.vertices = [];
    // generates a random number of vertices between MIN_VERTICES and MAX_VERTICES
    let numVertices = Math.round(Math.random()*(MAX_VERTICES - MIN_VERTICES)) + MIN_VERTICES;
    // creates the number of vertices
    for(let i = 0; i < numVertices; i++) {
      let v = new Vector();
      v.randomize(WIDTH, HEIGHT);
      this.vertices.push(v)
    }
    return this;
  }



  copy () {
    let vertices = [];
    for(let i in this.vertices)
      vertices[i] = this.vertices[i].copy();
    let c = new Shape(vertices);
    c.color = this.color;
    c.r = this.r;
    c.g = this.g;
    c.b = this.b;
    c.a = this.a;
    return c;
  }



  /**
   * Getter for the color property
   * @returns {String} The color of the shape
   */
  getColor () {
    return this.color;
  }



  /**
   * Setter for color
   * @param {String} c - The new color
   * @returns {Vector} This
   */
  setColor (c) {
    this.color = c;
    return this;
  }


  /**
   * Returns the number of vertices this shape has
   * @returns {Number} The number of vertices
   */
  getNumVertices () {
    return this.vertices.length;
  }

}
