class Population {
  constructor(sp, t, wr, hr, rad) {
    this.species = sp;
    this.total = t;
    this.w_range = wr;
    this.h_range = hr;
    this.rad = rad;
    this.deceased = [];
    this.arr = [];
  }
  show() {
    for (let i = 0; i < this.total; i++) {
      this.arr[i] = new this.species(
        createVector(random(width), random(height)),
        random(this.w_range - 85, this.w_range),
        random(this.h_range / 2, this.h_range),
        random(this.rad / 2, this.rad)
      );
    }
  }
  update() {
    for (let specie of this.arr) {
      if (!specie.isAlive()) {
        this.deceased.push(specie);
        this.arr.splice(this.arr.indexOf(specie), 1);
        this.total -= 1;
        break;
      }
      specie.show();
      specie.update();
      this.overLapOther(specie);
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
