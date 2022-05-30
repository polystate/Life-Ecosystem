class FoodGroup {
  constructor(name, f_class, col, active, attr) {
    this.name = name;
    this._Food = f_class;
    this.col = col;
    this.active = active;
    this.attr = attr;
    this.arr = [];
  }
  show(pop, numFoodGroups) {
    for (let i = 0; i < ceil(pop.total / numFoodGroups); i++) {
      this.arr[i] = new this._Food(random(15, 35), 100, this.col);
    }
  }
  update(pop, numFoodGroups) {
    for (let i = 0; i < ceil(pop.arr.length / numFoodGroups); i++) {
      this.arr[i].show();
      this.arr[i].update();
    }
  }
  attractSpecie(specie) {
    this.arr.forEach((food) => food.attract(specie));
  }
  specieIntersect(specie) {
    for (let food of this.arr) {
      if (specie.intersects(food)) {
        this.applyAttribute(specie);
        food.rad = food.rad / 2;
        // if (food.rad < 5) {
        //   this.arr.splice(this.arr.indexOf(food, 1);
        // }
      }
    }
  }
  applyAttribute(specie) {
    switch (this.name) {
      case "Berry":
        specie.energy += 125;
        break;
      case "Lime":
        specie.maxSpeed * 2;

        specie.energy += 75;
        setTimeout(() => {
          specie.maxSpeed / 2;
        }, 5000);
    }
  }
}
