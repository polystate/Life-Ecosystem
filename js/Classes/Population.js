class Population {
  constructor(sp, t, wr, hr, rad) {
    this.hivemind;
    this._species = sp;
    this.total = t;
    this.w_range = wr;
    this.h_range = hr;
    this.rad = rad;
    this.deceased = [];
    this.arr = [];
    this.fitness = [];
    this.matingPool = [];
    this.mutationRate = 0.01;
    this.worldRecord = 0;
    this.maxBitesTaken = 0;
    this.bestSpecie;
  }
  get specieBrains() {
    let hivemind;
    let specieBrains = this.arr.map((specie) => specie.brain);
    hivemind = new Hivemind(specieBrains);
    return hivemind;
  }
  show() {
    for (let i = 0; i < this.total; i++) {
      this.arr[i] = new this._species(
        createVector(random(width), random(height)),
        random(this.w_range - 85, this.w_range),
        random(this.h_range / 2, this.h_range),
        random(this.rad / 2, this.rad),
        this.w_range * this.h_range
      );
    }
  }
  update(foodGroupArr) {
    this.hivemind = this.specieBrains;
    this.hivemind.checkNetworks();

    let foodLocArr = foodGroupArr.map((foodArr) =>
      foodArr.arr.map((food) => ({ position: food.pos, f_name: food.name }))
    );

    for (let specie of this.arr) {
      if (!specie.hasHealth()) {
        if (specie.lifespan > this.worldRecord) {
          this.worldRecord = specie.lifespan;
        }
        if (specie.bitesTaken > this.maxBitesTaken) {
          this.maxBitesTaken = specie.bitesTaken;
          this.bestSpecie = specie;
        }

        this.fitness.push(
          specie.DNA.fitness(
            specie.lifespan,
            this.worldRecord,
            specie.bitesTaken,
            this.maxBitesTaken
          )
        );

        this.deceased.push(specie);

        this.arr.splice(this.arr.indexOf(specie), 1);
      }
      specie.show();
      let otherArrCopy = [...this.arr];
      specie.update(foodLocArr, otherArrCopy, foodGroupArr);

      this.checkPopulation();
    }
  }

  handleDeceased() {
    //egg
    push();
    stroke(8);
    fill("white");
    ellipse(dead.pos.x, dead.pos.y, dead.wid, dead.hei);
    pop();
  }

  checkPopulation() {
    if (!this.arr.length) {
      this.generateMatingPool();
      this.reproduction();
      console.log(this.worldRecord);
      this.hivemind = this.specieBrains;
      this.hivemind.checkNetworks();
      this.matingPool = [];
      this.fitness = [];
      this.deceased = [];
    }
  }

  generateMatingPool() {
    for (let i = 0; i < this.fitness.length; i++) {
      let selectionRate = this.fitness[i] * 100;
      for (let j = 0; j < selectionRate; j++) {
        this.matingPool.push(this.deceased[i]);
      }
    }
  }

  reproduction() {
    for (let i = 0; i < this.matingPool.length; i++) {
      let partnerA = random(this.matingPool);
      let partnerB = random(this.matingPool);
      let child = partnerA.DNA.crossover(partnerB.DNA);
      child.mutate(this.mutationRate);
      let newChild = new this._species(
        createVector(random(width), random(height)),
        child.genes[0],
        child.genes[1],
        child.genes[2],
        child.genes[3]
      );

      //child's brain not initialized yet
      if (this.arr.length < this.total) {
        // if (this.arr.length == 0) newChild.brain = this.bestSpecie.brain;
        this.arr.push(newChild);
      }
    }
  }

  // overLapOther(other) {
  //   let overlap = false;
  //   for (let specie of this.arr) {
  //     if (other !== specie && other.intersects(specie)) {
  //       overlap = true;
  //     }
  //   }
  //   if (overlap) {
  //     other.col = 80;
  //     other.alp = 180;
  //   } else {
  //     other.col = 0;
  //     other.alp = 30;
  //   }
  // }
}
