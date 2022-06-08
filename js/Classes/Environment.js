class Environment {
  constructor(population, allFood) {
    this.pop = population;
    this.foodGroupArr = allFood;
    this.map = [];
  }

  show() {
    for (const p of this.pop) {
      p.show();
    }
    for (let i = 0; i < this.pop.length; i++) {
      for (const foodGroup of this.foodGroupArr) {
        foodGroup.show(this.pop[i], this.foodGroupArr.length);
      }
    }
  }
  update() {
    background(50);
    for (const p of this.pop) {
      if (this.pop.length > 1) {
        for (let other of this.pop) {
          if (p !== other) {
            p.update(this.foodGroupArr, other);
          }
        }
      } else p.update(this.foodGroupArr);
    }
    for (const foodGroup of this.foodGroupArr) {
      for (const p of this.pop) {
        foodGroup.update(p, this.foodGroupArr.length);
      }
    }

    this.overLapFood();
    this.wall();
  }

  overLapFood() {
    for (const p of this.pop) {
      for (const specie of p.arr) {
        for (const foodGroup of this.foodGroupArr) {
          foodGroup.specieIntersect(specie);
        }
      }
    }
  }

  friction(specie, amount) {
    let coefficient = amount;
    let normal = 1;
    let frictionMag = coefficient * normal;
    let dir = specie.vel.copy();
    dir.normalize();
    dir.mult(-1);
    return dir.mult(frictionMag);
  }

  wall() {
    for (const p of this.pop) {
      for (const specie of p.arr) {
        if (
          specie.pos.x >= width - specie.wid / 2 ||
          specie.pos.x <= specie.wid / 2 ||
          specie.pos.y <= specie.wid / 2 ||
          specie.pos.y >= height - specie.wid / 2
        ) {
          specie.applyForce(this.friction(specie, 0.01));
        }
      }
    }
  }
}
