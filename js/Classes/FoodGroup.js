class FoodGroup {
  constructor(name, f_class, col) {
    this.name = name;
    this._Food = f_class;
    this.col = col;
    this.arr = [];
    // this.total = 64;
    // for (let i = 0; i < 8; i++) {
    //   this.arr[i] = new this._Food(random(15, 35), 100, this.col);
    // }
  }
  show(pop, numFoodGroups) {
    for (let i = 0; i < pop.arr.length / numFoodGroups; i++) {
      this.arr[i] = new this._Food(random(15, 35), 100, this.col);
    }
  }
  update(pop, numFoodGroups) {
    for (let i = 0; i < this.arr.length; i++) {
      this.arr[i].show();
      this.arr[i].update();
    }

    if (random(1) < 0.03 && this.arr.length < pop.arr.length) {
      this.arr.push(new this._Food(random(15, 35), 100, this.col));
    }
  }
  // attractSpecie(specie) {
  //   this.arr.forEach((food) => food.attract(specie));
  // }
  specieIntersect(specie) {
    for (let food of this.arr) {
      if (specie.intersects(food)) {
        this.applyAttribute(specie);
        food.rad = food.rad / 2;
        if (this.arr[this.arr.indexOf(food)].rad < 5) {
          this.arr.splice(this.arr.indexOf(food), 1);
        }
      }
    }
  }
  applyAttribute(specie) {
    switch (this.name) {
      case "Berry":
        specie.energy += 1;
        break;
      case "Lime":
        // specie.maxSpeed * 2;

        specie.energy += 1;
      // setTimeout(() => {
      //   specie.maxSpeed / 2;
      // }, 5000);
    }
  }
}
