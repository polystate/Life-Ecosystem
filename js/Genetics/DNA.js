class DNA {
  constructor(wid, hei, rad, mass, sight) {
    this.genes = [wid, hei, rad, mass, sight];
    this.movements = [];
  }
  fitness(lifespan, worldRecord) {
    if (lifespan > worldRecord) {
      worldRecord = lifespan;
    }
    lifespan = map(lifespan, 0, worldRecord, 0, 1);

    return lifespan;
  }
  crossover(partner) {
    let child = new DNA(
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined
    );
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
        this.genes[i] = random(32, 128);
      }
    }
  }
}
