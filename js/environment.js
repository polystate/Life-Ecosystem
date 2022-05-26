class Environment {
  constructor(population, allFood) {
    this.pop = population;
    this.foodArr = allFood;
    this.map = [];
    this.terrain = {
      mud: { col: 50, pos: null, effect: null },
      stone: {
        col: "#676767",
        pos: createVector(250, 200),
        wid: 200,
        hei: 400,
        // size: createVector(200, 400),
        effect: "specie position remains the same",
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
    for (const foodGroup of this.foodArr) {
      if (foodGroup.active) {
        foodGroup.show(this.pop, this.foodArr.length);
      }
    }
    this.overLapTerrain();
  }
  update() {
    this.drawMap();
    this.pop.update();
    for (const foodGroup of this.foodArr) {
      if (foodGroup.active) {
        foodGroup.update(this.pop, this.foodArr.length);
      }
    }

    this.overLapFood();
  }

  drawMap() {
    background(this.terrain.mud.col);
    this.drawTerrain(
      this.terrain.stone.col,
      this.terrain.stone.pos.x,
      this.terrain.stone.pos.y,
      this.terrain.stone.wid,
      this.terrain.stone.hei
    );
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
      for (const texture in this.terrain) {
        // console.log(`${texture}: ${this.terrain[texture].}`);
        if (this.terrain[texture].pos) {
          console.log(this.terrain[texture]);
          console.log(specie);
          if (this.boxCollision(specie, this.terrain[texture])) {
            console.log("colliding with stone");
          }
        }
      }
    }
  }

  boxCollision(obj1, obj2) {
    if (
      obj1.pos.x + obj1.wid >= obj2.pos.x &&
      obj1.pos.x <= obj2.pos.x + obj2.wid &&
      obj1.pos.y + obj1.pos.hei >= obj2.pos.y &&
      obj1.pos.y <= obj2.pos.y + obj2.hei
    ) {
      return true;
    }
  }

  overLapFood() {
    for (const specie of this.pop.arr) {
      for (const foodGroup of this.foodArr) {
        foodGroup.specieIntersect(specie);
      }
    }
  }
  decompose() {
    console.log(this.pop.deceased);
  }
}
