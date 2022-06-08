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
    this.maxBitesTaken = 0;
  }
  show() {
    for (let i = 0; i < this.total; i++) {
      this.arr[i] = new this._species(
        createVector(random(width), random(height)),
        random(this.w_range - 85, this.w_range),
        random(this.h_range / 2, this.h_range),
        random(this.rad / 2, this.rad),
        this.w_range * this.h_range,
        createVector(random(-1, 1), random(-1, 1))
      );
    }
  }
  update(foodGroupArr, pred) {
    let foodLocArr = foodGroupArr.map((foodArr) =>
      foodArr.arr.map((food) => food.pos)
    );
    let predPositions;
    if (pred) {
      predPositions = pred.arr.map((spider) => [spider.pos]);
    }
    for (let specie of this.arr) {
      if (!specie.hasEnergy()) {
        if (specie.lifespan > this.worldRecord) {
          this.worldRecord = specie.lifespan;
        }
        if (specie.bitesTaken > this.maxBitesTaken) {
          this.maxBitesTaken = specie.bitesTaken;
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
      specie.update(foodLocArr, this.arr, predPositions);
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
      console.log(this.maxBitesTaken);

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
        child.genes[3],
        createVector(random(-1, 1), random(-1, 1))
      );
      // newChild.brain = parentA.brain.copy();
      // console.log(newChild.brain);
      //just overwrite the weights after new child is created
      let partnerAIWeights = partnerA.brain.weights_ih.data;
      let partnerBIWeights = partnerB.brain.weights_ih.data;
      let partnerAOWeights = partnerA.brain.weights_ho.data;
      let partnerBOWeights = partnerB.brain.weights_ho.data;
      //
      let parentIHWeights = partnerAIWeights.concat(partnerBIWeights);

      let parentHOWeights = partnerAOWeights.concat(partnerBOWeights);
      let offSpringIHWeights = [];
      let offSpringHOWeights = [];
      for (let i = partnerAIWeights.length; i > 0; i--) {
        offSpringIHWeights.push(random(parentIHWeights));
        parentIHWeights.splice(
          parentIHWeights.indexOf(
            offSpringIHWeights[offSpringIHWeights.length - 1]
          ),
          1
        );
      }

      for (let i = partnerAIWeights.length; i > 0; i--) {
        offSpringHOWeights.push(random(parentHOWeights));
        parentHOWeights.splice(
          parentHOWeights.indexOf(
            offSpringHOWeights[offSpringHOWeights.length - 1]
          ),
          1
        );
      }
      newChild.brain.weights_ih.data = offSpringIHWeights;
      newChild.brain.weights_ho.data = offSpringHOWeights;
      newChild.brain.bias_h = random([
        partnerA.brain.bias_h,
        partnerB.brain.bias_h,
      ]);
      newChild.brain.bias_o = random([
        partnerA.brain.bias_o,
        partnerB.brain_bias_o,
      ]);
      // newChild.inputValues = [
      //   partnerA.brainMovement[0],
      //   partnerA.brainMovement[1],
      //   partnerB.brainMovement[0],
      //   partnerB.brainMovement[1],
      // ];

      // noLoop();
      if (this.arr.length < this.total) {
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
