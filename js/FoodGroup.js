class FoodGroup {
  constructor(n, f, c) {
    this.name = n;
    this._Food = f;
    this.col = c;
    this.arr = [];
  }
  show(pop) {
    for (let i = 0; i < ceil(pop.total / 2); i++) {
      this.arr[i] = new this._Food(random(15, 35), 100, this.col);
    }
  }
  update(pop) {
    for (let i = 0; i < ceil(pop.arr.length / 2); i++) {
      this.arr[i].show();
      this.arr[i].update();
    }
  }
}
