
/**
 * A Simple Vector
 */
class Vector {
  constructor (x, y, z) {
    this.isVector = true;
    if(x || y || z) {
      this.x = x;
      this.y = y;
      this.z = z;
    } else {
      this.x = Math.random();
      this.y = Math.random();
      this.z = Math.random();
    }
  }


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




  copy () {
    return new Vector(this.x, this.y, this.z);
  }



  /**
   * Randomly generates the x and y components
   * @param {Number} maxX - The maximum value for the x component to take
   * @param {Number} maxY - The maximum value for the y component to take
   * @returns {Vector} This
   */
  randomize (maxX, maxY) {
    this.x = Math.random() * maxX;
    this.y = Math.random() * maxY;
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
}
