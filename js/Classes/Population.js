class Population {
  constructor(sp, t, wr, hr, rad) {
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
  }
  show() {
    for (let i = 0; i < this.total; i++) {
      this.arr[i] = new this._species(
        createVector(random(width), random(height)),
        random(this.w_range - 85, this.w_range),
        random(this.h_range / 2, this.h_range),
        random(this.rad / 2, this.rad),
        this.w_range * this.h_range //maxMass
      );
    }
    // for (let specie in this.arr) {
    //   this.arr[specie].wormBrain();
    // }
  }
  update(foodGroupArr, pred) {
    let foodLocArr = foodGroupArr.map((foodArr) =>
      foodArr.arr.map((food) => food.pos)
    );

    let predPositions;
    if (pred) {
      predPositions = pred.arr.map((spider) => [spider.pos]);
    }
    // console.log(foodLocArr);
    // console.log(predPositions);
    // let predArr = pred.map((p) => p.pos);
    for (let specie of this.arr) {
      if (!specie.hasEnergy()) {
        if (specie.lifespan > this.worldRecord) {
          this.worldRecord = specie.lifespan;
        }

        this.fitness.push(
          specie.DNA.fitness(specie.lifespan, this.worldRecord)
        );
        this.deceased.push(specie);
        this.arr.splice(this.arr.indexOf(specie), 1);
        this.total -= 1;
      }
      specie.show();
      specie.update(foodLocArr, this.arr, predPositions);
      this.checkPopulation();
    }
  }

  checkPopulation() {
    if (!this.arr.length) {
      this.generateMatingPool();
      this.reproduction();
      console.log(this.worldRecord);
    }
  }

  // calcFitness() {
  //   for (let i = 0; i < this.deceased.length; i++) {
  //     this.fitness.push(this.deceased[i].DNA.fitness());
  //   }
  // }

  generateMatingPool() {
    for (let i = 0; i < this.fitness.length; i++) {
      let selectionRate = this.fitness[i] * 100; //add each member this amount of times to according to its fitness score
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

      // child.DNA.mutate(this.mutationRate);
      // this.arr[i] = child;
      let newChild = new this._species(
        createVector(random(width), random(height)),
        child.genes[0],
        child.genes[1],
        child.genes[2],
        child.genes[3]
        // child.genes[4]
      );
      if (this.arr.length < 4) {
        this.arr.push(newChild);
      }
    }
  }

  overLapOther(other) {
    let overlap = false;
    for (let specie of this.arr) {
      if (other !== specie && other.intersects(specie)) {
        overlap = true;
      }
    }
    if (overlap) {
      other.col = 80;
      other.alp = 180;
    } else {
      other.col = 0;
      other.alp = 30;
    }
  }
}
