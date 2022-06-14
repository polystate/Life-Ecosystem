class DNA {
  constructor(wid, hei, rad, mass) {
    this.genes = [wid, hei, rad, mass];
  }
  fitness(lifespan, worldRecord, bitesTaken, maxBitesTaken) {
    if (lifespan > worldRecord) {
      worldRecord = lifespan;
    }
    if (bitesTaken > maxBitesTaken) {
      maxBitesTaken = bitesTaken;
    }

    lifespan = map(lifespan, 0, worldRecord, 0, 1);
    bitesTaken = map(bitesTaken, 0, maxBitesTaken, 0, 1);

    return lifespan;
  }
  crossover(partner) {
    let child = new DNA();
    let geno_midpoint = random(this.genes.length);

    for (let i = 0; i < this.genes.length; i++) {
      if (i > geno_midpoint) {
        child.genes[i] = this.genes[i];
      } else child.genes[i] = partner.genes[i];
    }

    // for (let layer in crossWeights) {
    //   for (let weights in crossWeights[layer]) {
    //     console.log(crossWeights[layer][weights]);
    //     noLoop();
    //   }
    // }

    return child;
  }
  mutate(mutationRate) {
    for (let i = 0; i < this.genes.length; i++) {
      if (random(1) < mutationRate) {
        this.genes[i] = random(25, 150);
      }
    }

    // this.weights.map((layer) =>
    //   layer.map((weight) => {
    //     if (random(1) < mutationRate) {
    //       console.log("weight mutated");
    //       weight = random(-1, 1);
    //     }
    //   })
    // );
  }
}
