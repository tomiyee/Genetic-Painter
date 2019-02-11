
/**
 * A Simple Vector
 */
class Vector {


  constructor (x, y, z) {
    this.isVector = true;
    if(!isNaN(x))
      this.x = x;
    if(!isNaN(y))
      this.y = y;
    if(!isNaN(z))
      this.z = z;
    if(!x && !y && !z) {
      this.x = Math.random();
      this.y = Math.random();
      this.z = Math.random();
    }

    this.dimensions = 0;

    // counts the number of dimensions
    !isNaN(this.x) ? this.dimensions++ : 0;
    !isNaN(this.y) ? this.dimensions++ : 0;
    !isNaN(this.z) ? this.dimensions++ : 0;
  }



  /**
   * Adds the other vector to this vector. Unless told otherwise, will NOT override
   * this vector and will instead return a different vector.
   *
   * @param {Vector} other - The second vector
   * @param {Boolean} [override] - false by default, if true, will override this vector's values
   * @ returns {Vector} Returns a new vector with the result of the addition, otherwise returns this
   */
  add (other, override) {
    // if(!this.sameDimensions(other))
    //   return console.error("Cannot add Vectors of unequal dimensions");

    if(!override)
      return this.dimensions > 2 ? new Vector(
        this.x + other.x,
        this.y + other.y,
        this.z + other.z,
      ): new Vector (
        this.x + other.x,
        this.y + other.y
      );

    this.x += other.x;
    this.y += other.y;
    this.z += other.z;
    return this;
  }



  /**
   * Subtracts the other vector from the current one
   *
   * @param  {Vector} other - The other vector
   * @param  {type} [override] - Default falseIf true, overr
   * @return {Vector} A new vector that is the result of subtraction.
   */
  subtract (other, override) {
    // if(!this.sameDimensions(other))
    //   return console.error("Cannot subtract Vectors of unequal dimensions");

    if(!override)
      return this.dimensions > 2 ? new Vector(
        this.x - other.x,
        this.y - other.y,
        this.z - other.z,
      ): new Vector (
        this.x - other.x,
        this.y - other.y
      );

    this.x -= other.x;
    this.y -= other.y;
    this.z -= other.z;
    return this;
  }



  /**
   * Given another vector, checks if the two vectors are the
   * same number of dimensions.
   *
   * @param {Vector} other - the vector to compare with this vector
   * @returns {boolean} true if the two vectors have the same number of dimensions
   */
  sameDimensions(other) {
    if(!other)
      return console.error("No vector given to sameDimensions property.");
    if(!other.isVector)
      return console.error("Vector sameDimensions method did not get a vector.");
    return this.dimensions == other.dimensions;
  }



  /**
   * Calculates the Euclidean distance between vectors
   * @param {Vector} other - The other vector
   * @returns {Number} distance between the two vectors
   */
  distanceTo(other) {
    let sum = 0;
    if(!isNaN(this.x) && !isNaN(other.x))
      sum += (this.x - other.x) ** 2;
    if(!isNaN(this.y) && !isNaN(other.y))
      sum += (this.y - other.y) ** 2;
    if(!isNaN(this.z) && !isNaN(other.z))
      sum += (this.z - other.z) ** 2;
    return Math.sqrt(sum);
  }



  /**
   * Returns true if the values in the vectors are identical
   * @param {Vector} other - The other vector
   * @returns {Boolean} true if the vectors are the same, false otherwise
   */
  equals (other){
    if(!other.hasOwnProperty('isVector') || !other.isVector)
      return false;
    if(this.x != other.x)
      return false;
    if(this.y != other.y)
      return false;
    if(this.z != other.z)
      return false;
    return true;
  }



  /**
   * Returns an identical vecotr with all the properties
   * @returns {Vector} a copy of this vector
   */
  copy () {
    return new Vector(this.x, this.y, this.z);
  }



  /**
   * Randomly generates the x and y components
   * @param {Number} maxX - The maximum value for the x component to take
   * @param {Number} maxY - The maximum value for the y component to take
   * @returns {Vector} This
   */
  randomize (maxX, maxY, maxZ) {
    this.x = Math.random() * maxX;
    this.y = Math.random() * maxY;
    this.z = Math.random() * maxZ;
  }



  /**
   * Finds the angle of this vector relative to a given vector,
   * beginning with the other vector and going counter-clockwise
   * until hitting the current angle
   *
   * @param  {Vector} other - The other vector
   * @return {Number} The relative angle in radians
   */
  getRelativeAngle(other) {
    // finds the angles of the vectors relative to the horizontal
    // then subtracts these angles to get the angle of this vector
    // relative to the other vector
    const relAngle = (this.y > 0 ? 1 : -1) * Math.acos(this.x/this.length()) -
                     (other.y > 0 ? 1 : -1) * Math.acos(other.x/other.length());
    return relAngle;
  }



  /**
   * Determines the smallest positive angle between the two vectors
   *
   * @param  {Vectors} other - The other vector
   * @return {Number} the angle between the vectors in radians
   */
  getAngle(other) {
    return Math.acos(this.dot(other)/(this.length()*other.length()))
  }



  /**
   * Scales the values of this vector by the given scaling factor
   * @param {Number} factor - The magnitude to be scaled
   * @returns {Vector} This vector
   */
  scale (factor) {
    this.x *= factor;
    this.y *= factor;
    this.z *= factor;
    return this;
  }



  /**
   * Returns the size of the vector
   * @returns {Number} The length of the vector
   */
  length () {
    return Math.sqrt( this.x**2 + this.y**2 + (this.dimensions > 2 ? this.z**2 : 0));
  }



  /**
   * Returns the dot product between this vector and the other
   * @param {Vector} other - the other vector to be dot product-ing(?)
   * @returns {Number} You guessed it
   */
  /*
  dot (other) {
    // if(!this.sameDimensions(other))
    //   return console.error("The dimensions of the two vectors are not the same. Cannot dot product.");
    return this.x*other.x+this.y*other.y + (!isNaN(this.z) && !isNaN(other.z) ? this.z*other.z:0);
  }



  /**
   * Returns a new 3D vector that is the cross product of the two vectors: this x other
   * @param {Vector} other - the other vector to be cross producted
   * returns {Vector} The resulting 3D vector from this x other
   */
  /*
  cross (other) {
    return new Vector(this.y*other.z-this.z*other.y,
      this.z*other.x-other.z*this.x,
      this.x*other.y-other.x*this.y);
  }


  /**
   * toString - Returns a string
   *
   * @return {String}  A representation of this vector
   */
  toString () {
    return this.dimensions == 2 ? `(${this.x}, ${this.y})` : `(${this.x}, ${this.y}, ${this.z})`;
  }
}
