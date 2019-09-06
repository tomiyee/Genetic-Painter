
/**
 * A Painter is a single Painter within a population
 * Which will paint one attempt of the target painting
 */
class Painter {

  constructor (genes) {
    // prepares a canvas specifically for this painter
    this.canvas = invisibleCanvas;
    this.ctx = this.canvas.getContext('2d');

    this.fitness = null;
    // generates the genes, or extends the given genes if necessary
    this.genes = genes || [];
    for(let i = this.genes.length; i < numGenes; i++)
      this.genes.push(new Shape());
  }



  /**
   * This will return the fitness of the Painting, which is determined
   * via the inverse of the RMSE between the canvas and the target painting
   * Does NOT require the painting to be drawn already
   */
  evaluate () {
    // if already has fitness, return that instead
    if(this.fitness != null)
      return 1/this.fitness;
    this.ctx.fillStyle = 'rgba (0,0,0,1)';
    this.ctx.fillRect(0,0,W,H);
    for(var shape of this.genes)
      shape.draw(this.ctx);
    // The painter is exhibiting its artwork
    let myPainting = this.ctx.getImageData(0, 0, W, H).data;
    // The judge will check how bad the painting is
    let succScale = calcError(myPainting);
    if(SHOW_RATINGS)
      console.log("On a scale of 0 to 255, this painting sucks - " + succScale);
    // The painter's chances of making children increases with a small succScale
    this.fitness = 1/succScale;
    return succScale;
  }



  /**
   * The Painter will exhibit its painting at the given
   * canvas
   *
   * @param {Canvas} canvas - An HTML canvas
   */
  exhibit (canvas) {
    let museum = canvas.getContext("2d");
    museum.fillStyle = 'rgba(0,0,0,1)';
    museum.fillRect(0,0,W,H);
    // this.genes[0].draw(museum);
    for(var shape of this.genes)
      shape.draw(museum);
  }







  /**
   * Here this painting will be given a mate, aka another Painter,
   * And together shall make a wonderful painter child, which may be
   * Better or worse at drawing the image. The breeding is done by
   * Randomly swapping genes (crossover) and by either tweaking those
   * Genes slightly, or by completely changing those genetics (mutation)
   * @param {Painter} mate - A different Painter to be bred with
   * @returns {Shape[]} A list of shapes that serve as the genes of the next Painter
   */
  breed (mate) {

    let mateGenes = mate.genes;
    let mineGenes = this.genes;
    let childGenes = new Array(mateGenes.length);

    // crossover the genes
    for(let i = 0, geneLength = mateGenes.length; i < geneLength; i++) {

      let gene = Math.random() < 1/2 ? mateGenes[i].copy() : mineGenes[i].copy();

      // randomly mutates the above gene
      if(Math.random() < mutationRate) {

        // tweaks the color of the shapes
        gene.r = Math.abs (gene.r + (randInt(0,1) ? -1 : 1) * random(MIN_COLOR_SHIFT,MAX_COLOR_SHIFT));
        gene.g = Math.abs (gene.g + (randInt(0,1) ? -1 : 1) * random(MIN_COLOR_SHIFT,MAX_COLOR_SHIFT));
        gene.b = Math.abs (gene.b + (randInt(0,1) ? -1 : 1) * random(MIN_COLOR_SHIFT,MAX_COLOR_SHIFT));

        gene.r = gene.r > 255 ? 255: gene.r;
        gene.g = gene.g > 255 ? 255: gene.g;
        gene.b = gene.b > 255 ? 255: gene.b;

        gene.setColor(`rgba(${gene.r}, ${gene.g}, ${gene.b}, ${gene.a})`);

        // tweaks the vertices of the shape gene
        let numMutationTypes = 3;

        tweak(gene);

        /*
        switch (randInt(0,numMutationTypes-1)) {
          // type 1 - Rotation
          case 0:
            // Rotate all the vertices by some random angle about the centroid
            let centroid = gene.centroid();

            let dtheta = random(0, 2*Math.PI);

            for(let v = 0; v < gene.vertices.length; v++){
              let vertex = gene.vertices[v]
              const relativeAngle = vertex.subtract(centroid).getRelativeAngle(new Vector(1,0,0));
              const relativeDistance = vertex.distanceTo(centroid);

              vertex.x = centroid.x + relativeDistance * Math.cos(relativeAngle + dtheta);
              vertex.y = centroid.y + relativeDistance * Math.sin(relativeAngle + dtheta);
            }
            break;
          case 1:
            // get centroid
            let theta = random(0, 2*Math.PI);
            let shift = (new Vector(Math.cos(theta), Math.sin(theta))).scale(random(MIN_VERTEX_SHIFT, MAX_VERTEX_SHIFT));

            let newCentroid = gene.centroid().add(shift, true);

            // check if the shift results in the triangle going off screen
            if(newCentroid.x > W-MAX_SIDE_LENGTH/2)
              shift.x -= newCentroid.x - W+MAX_SIDE_LENGTH/2;

            else if(newCentroid.x < MAX_SIDE_LENGTH/2)
              shift.x -= newCentroid.x - MAX_SIDE_LENGTH/2;

            if(newCentroid.y > H-MAX_SIDE_LENGTH/2)
              shift.y -= newCentroid.y - H+MAX_SIDE_LENGTH/2;

            else if(newCentroid.y < MAX_SIDE_LENGTH/2)
              shift.y -= newCentroid.y - MAX_SIDE_LENGTH/2;

            for(let vi = 0; vi < gene.vertices.length; vi++)
              gene.vertices[vi].add(shift, true);

            break;
          case 2:
            for(let vertexIndex = 0; vertexIndex < gene.vertices.length; vertexIndex++) {
              //acquires the vertex and its adjacent vertices
              let prevVertex = vertexIndex == 0 ? gene.vertices[gene.vertices.length-1] : gene.vertices[vertexIndex - 1]
              let nextVertex = vertexIndex == gene.vertices.length-1 ? gene.vertices[0] : gene.vertices[vertexIndex + 1]
              let v = gene.vertices[vertexIndex];

              // generate a random shift
              let shift = new Vector(
                (Math.random() < 0.5 ? -1 : 1) * random(MIN_VERTEX_SHIFT, MAX_VERTEX_SHIFT),
                (Math.random() < 0.5 ? -1 : 1) * random(MIN_VERTEX_SHIFT, MAX_VERTEX_SHIFT));

              // check if the new shift results
              let newV = v.add(shift);

              // don't do the shift if you violate the restraint
              if(newV.distanceTo(prevVertex) > MAX_SIDE_LENGTH || newV.distanceTo(prevVertex) < MIN_SIDE_LENGTH)
                continue;
              if(newV.distanceTo(nextVertex) > MAX_SIDE_LENGTH || newV.distanceTo(nextVertex) < MIN_SIDE_LENGTH)
                continue;

              // shift the vertex
              v.add(shift, true);
              v.x = v.x < 0 ? 0 : (v.x > W ? W : v.x);
              v.y = v.y < 0 ? 0 : (v.y > H ? H : v.y);
            }
            break
        }
        */
      }
      childGenes[i] = gene;
    }

    return childGenes;
  }

}
