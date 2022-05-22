class Environment {
  constructor(p, v) {
    this.pop = p;
    this.veg = v;
  }
  show() {
    this.pop.show();
    this.veg.show(this.pop);
  }
  update() {
    this.pop.update();
    this.veg.update(this.pop);
    this.overLapFood();
  }

  overLapFood() {
    for (let specie of this.pop.arr) {
      for (let f of this.veg.arr) {
        if (specie.intersects(f)) {
          specie.energy += 1000;
          f.rad = f.rad / 2;
          break;
        }
      }
    }
  }
}
