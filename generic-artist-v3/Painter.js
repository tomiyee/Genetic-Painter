
/**
 * A Painter is a single Painter within a population
 * Which will paint one attempt of the target painting
 */
class Painter {

  constructor (genes) {
    // prepares a canvas specifically for this painter
    this.canvas = document.createElement('canvas');
    this.canvas.width = W;
    this.canvas.height = H;
    this.canvas.style.display = 'none';
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
   * Museum, which defaults to the global museum
   * @param {Canvas2DContext} museum - A canvas's 2D context
   */
  exhibit (museum) {
    let context = museum || ctx;
    context.fillStyle = 'rgba(0, 0, 0, 1)';
    context.fillRect(0,0,W,H);
    for(var shape of this.genes)
      shape.draw(context);
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
    let mateGenes = mate.genes.slice();
    let mineGenes = this.genes.slice();
    // Make children's genepool
    let genePool = mateGenes.concat(mineGenes);
    let childGenes = [];

    // crossover the genes
    for(let i = 0; i < mateGenes.length; i++) {
      let source = Math.random() < 1/2 ? mateGenes : mineGenes;
      childGenes.push(source[i].copy());

      // randomly mutates a gene
      if(Math.random() < mutationRate) {
        let gene = childGenes[childGenes.length-1];
        // tweaks the vertices
        for(let j in gene.vertices) {
          let v = gene.vertices[j];
          do {
          v.x += (Math.random() < 0.5 ? -1 : 1) * Math.random() * (MAX_VERTEX_SHIFT - MIN_VERTEX_SHIFT) + MIN_VERTEX_SHIFT;
          v.y += (Math.random() < 0.5 ? -1 : 1) * Math.random() * (MAX_VERTEX_SHIFT - MIN_VERTEX_SHIFT) + MIN_VERTEX_SHIFT;
          if(v.x < 0)
            v.x = 0;
          if(v.x > W)
            v.x = W;
          if(v.y < 0)
            v.y = 0;
          if(v.y > H)
            v.y = H;
          } while (gene.vertices[j].distanceTo(gene.vertices[0] > MAX_DIST))
        }
        // tweaks the color of the shapes
        gene.r = Math.abs (gene.r + (Math.random() < 0.5 ? -1 : 1) * (Math.random () * (MAX_COLOR_SHIFT - MIN_COLOR_SHIFT) + MIN_COLOR_SHIFT));
        gene.g = Math.abs (gene.g + (Math.random() < 0.5 ? -1 : 1) * (Math.random () * (MAX_COLOR_SHIFT - MIN_COLOR_SHIFT) + MIN_COLOR_SHIFT));
        gene.b = Math.abs (gene.b + (Math.random() < 0.5 ? -1 : 1) * (Math.random () * (MAX_COLOR_SHIFT - MIN_COLOR_SHIFT) + MIN_COLOR_SHIFT));
        if(gene.r > 255)
          gene.r = 255;
        if(gene.g > 255)
          gene.g = 255;
        if(gene.b > 255)
          gene.b = 255;
        gene.setColor(`rgba(${gene.r}, ${gene.g}, ${gene.b}, ${gene.a})`);
      }
    }

    return childGenes;
  }

}
