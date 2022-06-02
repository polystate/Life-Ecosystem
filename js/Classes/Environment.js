class Environment {
  constructor(population, allFood) {
    this.pop = population;
    this.foodGroupArr = allFood;
    this.map = [];
    this.terrain = {
      mud: { col: 50, pos: null, wid: null, hei: null },
      stone: {
        col: "#676767",
        pos: createVector(200, 200),
        wid: 25,
        hei: 100,
      },
    };
  }

  show() {
    for (const p of this.pop) {
      p.show();
    }
    // this.pop.show();
    for (let i = 0; i < this.pop.length; i++) {
      for (const foodGroup of this.foodGroupArr) {
        foodGroup.show(this.pop[i], this.foodGroupArr.length);
      }
    }
  }
  update() {
    this.drawMap();

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

  drawMap() {
    background(this.terrain.mud.col);
    // this.drawTerrain(
    //   this.terrain.stone.col,
    //   this.terrain.stone.pos.x,
    //   this.terrain.stone.pos.y,
    //   this.terrain.stone.wid,
    //   this.terrain.stone.hei
    // );
  }

  drawTerrain(texture, x, y, w, h) {
    push();
    noStroke();
    fill(texture);
    rect(x, y, w, h);
    pop();
  }

  // overLapTerrain() {
  //   for (const p of this.pop.arr) {
  //     for (const specie of this.pop.arr) {
  //       // specie.applyForce(this.friction(specie, 0.04));
  //     }
  //   }
  // }

  overLapFood() {
    for (const p of this.pop) {
      for (const specie of p.arr) {
        for (const foodGroup of this.foodGroupArr) {
          // foodGroup.attractSpecie(specie);

          foodGroup.specieIntersect(specie);
        }
      }
    }
  }
  // decompose() {
  //   console.log(this.pop.deceased);
  // }

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
