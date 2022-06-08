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
    console.log(bitesTaken);

    return lifespan + bitesTaken;
  }
  crossover(partner) {
    let child = new DNA();
    let midpoint = random(this.genes.length);

    for (let i = 0; i < this.genes.length; i++) {
      if (i > midpoint) {
        child.genes[i] = this.genes[i];
      } else child.genes[i] = partner.genes[i];
    }
    return child;
  }
  mutate(mutationRate) {
    for (let i = 0; i < this.genes.length; i++) {
      if (random(1) < mutationRate) {
        this.genes[i] = random(25, 175);
      }
    }
  }
}
