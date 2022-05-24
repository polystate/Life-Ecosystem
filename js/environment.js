class Environment {
  constructor(population, allFood) {
    this.pop = population;
    this.foodArr = allFood;
  }
  show() {
    this.pop.show();
    for (let foodGroup of this.foodArr) {
      if (foodGroup.active) {
        foodGroup.show(this.pop, this.foodArr.length);
      }
    }
  }
  update() {
    this.pop.update();
    for (let foodGroup of this.foodArr) {
      if (foodGroup.active) {
        foodGroup.update(this.pop, this.foodArr.length);
      }
    }
    this.overLapFood();
  }

  decompose() {
    console.log(this.pop.deceased);
  }

  overLapFood() {
    for (let specie of this.pop.arr) {
      for (let foodGroup of this.foodArr) {
        foodGroup.specieIntersect(specie);
      }
    }
  }
}
