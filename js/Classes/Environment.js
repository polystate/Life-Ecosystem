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

      // sand: {
      //   col: "#eecda3",
      //   loc: createVector(500, 600),
      //   effect: "specie can get ensnared and trapped in quicksand",
      // },
      // grass: {
      //   col: "#4A5D23",
      //   loc: createVector(100, 400),
      //   effect: "specie's acceleration goes up a little bit",
      // },
      // water: {
      //   col: "#064273",
      //   loc: createVector(610, 670),
      //   effect: "specie slides with friction",
      // },
    };
  }

  show() {
    this.pop.show();
    for (const foodGroup of this.foodGroupArr) {
      if (foodGroup.active) {
        foodGroup.show(this.pop, this.foodGroupArr.length);
      }
    }
  }
  update() {
    this.drawMap();
    this.pop.update(this.foodGroupArr);
    for (const foodGroup of this.foodGroupArr) {
      if (foodGroup.active) {
        foodGroup.update(this.pop, this.foodGroupArr.length);
      }
    }

    this.overLapFood();
    this.wall();
    this.overLapTerrain();
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

  overLapTerrain() {
    for (const specie of this.pop.arr) {
      // specie.applyForce(this.friction(specie, 0.04));
    }
  }

  overLapFood() {
    for (const specie of this.pop.arr) {
      for (const foodGroup of this.foodGroupArr) {
        // foodGroup.attractSpecie(specie);

        foodGroup.specieIntersect(specie);
      }
    }
  }
  decompose() {
    console.log(this.pop.deceased);
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
    for (const specie of this.pop.arr) {
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
