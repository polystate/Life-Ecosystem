class Vegetation {
  constructor(f, c) {
    this.classFood = f;
    this.col = c;
    this.arr = [];
  }
  show(pop) {
    for (let i = 0; i < floor(pop.total / 2); i++) {
      this.arr[i] = new this.classFood(random(15, 35), 100, this.col);
    }
  }
  update(pop) {
    for (let i = 0; i < ceil(pop.arr.length / 2); i++) {
      this.arr[i].show();
      this.arr[i].update();
    }
  }
}
