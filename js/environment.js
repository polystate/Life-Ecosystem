class Environment {
  constructor(population, allFood) {
    this.pop = population;
    this.foodArr = allFood;
  }
  show() {
    this.pop.show();
    for (let foodGroup of this.foodArr) {
      foodGroup.show(this.pop);
    }
  }
  update() {
    this.pop.update();
    for (let foodGroup of this.foodArr) {
      foodGroup.update(this.pop);
    }
    this.overLapFood();
  }

  //FoodGroup should determine what happens when a Specie interacts with it, not Environment, although you can write switch conditional logic here for now

  overLapFood() {
    for (let specie of this.pop.arr) {
      for (let foodGroup of this.foodArr) {
        for (let food of foodGroup.arr) {
          if (specie.intersects(food)) {
            specie.energy += 1000;
            food.rad = food.rad / 2;
            break;
          }
        }
      }
    }
  }
}
