class Population {
  constructor(sp, t, wr, hr, vr) {
    this.species = sp;
    this.total = t;
    this.wrange = wr;
    this.hrange = hr;
    this.vrange = vr;
    this.arr = [];
  }
  show() {
    for (let i = 0; i < this.total; i++) {
      this.arr[i] = new this.species(
        random(this.wrange - 85, this.wrange),
        35,
        random(this.hrange / 2, this.hrange), //originally at 50
        createVector(random(width), random(height)),
        createVector(
          random(-this.vrange, this.vrange),
          random(-this.vrange, this.vrange)
        )
      );
    }
  }
  update() {
    for (let specie of this.arr) {
      if (!specie.isAlive()) {
        this.arr.splice(this.arr.indexOf(specie), 1);
        this.total -= 1;
        console.log(this.arr);
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
