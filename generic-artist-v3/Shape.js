

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
    context.fillStyle = `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
    context.beginPath();
    context.moveTo(this.vertices[0].x, this.vertices[0].y);
    for(let i = 1; i < this.vertices.length; i++)
      context.lineTo(this.vertices[i].x, this.vertices[i].y);
    context.closePath();
    context.fill();
  }




  /**
   * equals - Checks if the two shapes are equal to each other
   *
   * @param  {Shape} other - The other shape
   * @return {Boolean} true if all the properties of the shape are identical
   */
  equals (other) {
    if(!other.hasOwnProperty('isShape') || !other.isShape)
      return false;
    if(this.vertices.length != other.vertices.length)
      return false;
    if(this.color != other.color)
      return false;
    for(let i in this.vertices)
      if(!this.vertices[i].equals(other.vertices[i]))
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
    let a;
    if (RANDOMIZE_SHAPE_ALPHA)
      a = Math.random () * (MAX_ALPHA - MIN_ALPHA) + MIN_ALPHA;
    else
      a = ALPHA;

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
    let v = new Vector();
    v.randomize(W, H);
    this.vertices.push(v);
    // creates the number of vertices
    for(let i = 1; i < numVertices; i++) {
      // generates a random angle and a random distance
      const theta = Math.random() * 2 * Math.PI;
      const dist = Math.random() * MAX_DIST;
      // generates the resulting x and y that is the given angle and distance from the first vertex
      const x = this.vertices[0].getX() + dist * Math.cos(theta);
      const y = this.vertices[0].getY() + dist * Math.sin(theta);
      // appends the vector
      let v = new Vector(x, y);
      this.vertices.push(v)
    }
    return this;
  }



  /**
   * Returns a new Shape object with identical properties
   */
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
   * Returns a vector representing the location of the
   * centroid of this shape, given this is a triangle
   *
   * @return {Vector} The position of the centroid
   */
  centroid () {
    let x = 0;
    let y = 0;
    for (v of this.vertices) {
      x += v.x;
      y += v.y;
    }
    return new Vector(x/3, y/3);
  }



  /**
   * Returns the area of the shape
   */
  area() {
    if (this.vertices.length > 3)
      return console.error("Error, the area function does not work with polygons beyond triangles!");

    let ab = this.vertices[0].subtract(this.vertices[1]);
    let ac = this.vertices[0].subtract(this.vertices[2]);

    return 0.5*ab.cross(ac).length();
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
