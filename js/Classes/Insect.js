class Insect {
  constructor(pos, wid, hei, rad, maxMass, col = 0, alpha = 30) {
    this.pos = pos;
    this.wid = wid;
    this.hei = hei;
    this.rad = rad;
    this.maxMass = maxMass;
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.mass = ceil(this.wid * this.hei + this.rad);
    this.sight = map(this.rad, 36, 72, 6, 9);
    this.brain = new Brain(7, 4);
    this.energy = 8;
    this.health = this.energy / 2;
    this.col = col;
    this.alp = alpha;
    this.maxSpeed = maxMass / this.mass;
    this.maxForce = 0.1;
    this.angle = 0;
    this.angV = 0;
    this.aAcc = 0.001;
    this.steer = 0;
    this.DNA = new DNA(this.wid, this.hei, this.rad, this.mass);
    this.lifespan = 0;
    this.bitesTaken = 0;
  }

  show() {
    push();

    rectMode(CENTER);
    noStroke();
    fill(this.col, this.alp);
    this.pos.x = constrain(this.pos.x, this.wid / 2, width - this.wid / 2);
    this.pos.y = constrain(this.pos.y, this.wid / 2, height - this.wid / 2);
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading());
    rect(0, 0, this.wid, this.hei, this.rad);
    strokeWeight(1);
    stroke("white");
    this.vision();
    pop();
    this.arm(0.05, this.pos);
  }

  brainStartup(foodLocArr, otherArr) {
    const mapAndNormalize = (arr) => {
      if (arr.length == 0) return [0, 0];
      arr.flat(Infinity);
      let nearestTarget = this.getNearestTarget(arr).copy();
      let nearestX;
      let nearestY;
      if (!nearestTarget) {
        nearestX = 0;
        nearestY = 0;
      } else {
        nearestX = map(nearestTarget.x, 0, width, -1, 1);
        nearestY = map(nearestTarget.y, 0, height, -1, 1);
      }

      return [nearestX, nearestY];
    };
    let berries = foodLocArr[0].map((e) => e.position);
    let limes = foodLocArr[1].map((e) => e.position);
    let otherPositions = otherArr.map((other) => other.pos);
    for (let i = 0; i < otherPositions.length; i++) {
      if (this.pos.dist(otherPositions[i]) == 0) {
        otherPositions.splice(i, 1);
      }
    }
    let foodPositions = foodLocArr.map((foodGroup) => {
      return foodGroup.map((food) => {
        return food.position;
      });
    });

    let positionX = map(this.pos.x, 0, width, -1, 1);
    let positionY = map(this.pos.y, 0, height, -1, 1);
    let energyMap = map(this.energy, 0, 8, -1, 1);
    // let maxSpeedMap = map(this.maxSpeed, 0, this.energy, 0, 1);
    // let healthMap = map(this.health, 0, this.health, 0, 1);
    // let massMap = map(this.mass, 0, 12000, -1, 1);
    // let heightMap = map(this.hei, 0, 60, 0, 1);
    // let widthMap = map(this.wid, 0, 200, 0, 1);
    // let radMap = map(this.rad, 0, 72, 0, 1);

    //feeding forward a singular value, not an array of two values

    //get the distance for the foods from positions instead as those are dynamically changing values
    let outputs = this.brain.feedForward([
      positionX,
      positionY,
      energyMap,
      mapAndNormalize(foodPositions[0])[0],
      mapAndNormalize(foodPositions[0])[1],
      mapAndNormalize(foodPositions[1])[0],
      mapAndNormalize(foodPositions[1])[1],
    ]);

    return outputs;
  }

  update(foodLocArr, otherArr, predator = null) {
    this.eye("lightblue", this.sight);

    this.movement(this.brainStartup(foodLocArr, otherArr));

    if (this.hasEnergy()) {
      this.lifespan++;
      this.vel.add(this.acc);
      this.vel.limit(this.maxSpeed);
      this.pos.add(this.vel);
      this.acc.mult(0);
    } else if (this.hasHealth()) {
      this.lifespan++;
      this.health -= 0.01;
      this.vel.add(this.acc);
      this.vel.limit(this.maxSpeed);
      this.pos.add(this.vel);
      this.acc.mult(0);
    }
  }

  movement(outputs) {
    if (outputs[0]) {
      this.applyForce(createVector(0, -1));
    }
    if (outputs[1]) {
      this.applyForce(createVector(0, 1));
    }
    if (outputs[2]) {
      this.applyForce(createVector(-1, 0));
    }
    if (outputs[3]) {
      this.applyForce(createVector(1, 0));
    }

    // if (outputs[4]) {
    //   this.applyForce(this.seek(createVector(width / 2, height / 2)));
    // }
  }

  applyBehaviors(foodLocArr, otherArr, predator) {
    let separate = this.separate(otherArr);
    let seek = this.seek(this.getNearestTarget(foodLocArr));
    if (predator) {
      let flee = this.flee(this.getNearestTarget(predator));
      flee.mult(2);
      this.applyForce(flee);
    }
    separate.mult(0.75);

    if (foodLocArr[0].length) {
      seek.mult(5 / this.energy);
    }

    this.applyForce(separate);
    this.applyForce(seek);
  }

  separate(otherArr) {
    let sum = createVector(0, 0);
    let count = 0;
    let desiredSeparation = 200;
    let dist;
    let diff;
    for (let other of otherArr) {
      dist = this.pos.dist(other.pos);
      if (dist > 0 && dist < desiredSeparation) {
        diff = p5.Vector.sub(this.pos, other.pos);
        diff.normalize();
        sum.add(diff);
        count++;
      }
    }
    if (count > 0) {
      sum.div(count);
    }

    sum.setMag(this.maxSpeed);
    let steer = p5.Vector.sub(sum, this.vel);
    steer.limit(this.maxForce);
    return steer;
  }

  flee(targetVect) {
    if (!targetVect) {
      return;
    }

    let desired = p5.Vector.sub(targetVect, this.pos);
    desired.normalize();
    desired.mult(this.maxSpeed);
    let steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxForce);
    steer.mult(-1);
    return steer;
  }

  seek(targetVect) {
    if (!targetVect) {
      return;
    }

    let desired = p5.Vector.sub(targetVect, this.pos);
    desired.normalize();
    desired.mult(this.maxSpeed);
    let steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxForce);
    return steer;
  }

  getNearestTarget(vectorArr) {
    // vectorArr = vectorArr.flat();
    // console.log(vectorArr);
    let nearest = vectorArr.map((vect) => this.pos.dist(vect));
    nearest = nearest.indexOf(Math.min(...nearest));

    return vectorArr[nearest];
  }

  applyForce(forceVect) {
    if (!forceVect) return;
    let force = forceVect.copy();
    // force.div(this.mass);
    this.acc.add(force);
  }

  hasHealth() {
    return this.health > 0;
  }

  hasEnergy() {
    this.energy -= 0.01;
    return this.energy > 0;
  }

  intersects(other) {
    let dist = this.pos.dist(other.pos);
    return dist < this.rad + other.rad;
  }

  arm(movement, originVect) {
    let armAng = createVector(0, 0);
    let armVel = createVector(
      random(-movement, movement),
      random(-movement, movement)
    );
    let armAmp = createVector(random(-this.hei / 2), random(this.hei / 2));

    push();
    armAng.add(armVel);
    let floatX = sin(armAng.x) * armAmp.x;
    let floatY = sin(armAng.y) * armAmp.y;
    this.angle += this.angV;
    this.angV += this.aAcc;
    this.aAcc = random(-movement, movement);
    this.angV = constrain(this.angV, -movement, movement);
    strokeWeight(2);
    stroke("black");
    translate(originVect.x, originVect.y);
    rotate(this.angle);
    rotate(armAng);
    line(floatX, armAmp.y, floatY, armAmp.y + this.hei);
    line(floatX, armAmp.x, floatY, armAmp.x + -this.hei);
    //fly
    // triangle(200, 200, 80);
    pop();
  }

  vision(other) {
    let vacinity = pow(this.sight, 3);
    let newValue = other - vacinity;
    if (newValue < vacinity) {
      return true;
    }
    return false;
  }

  eye(mood, sight, nearestTarget = 0) {
    push();
    rectMode(CENTER);
    fill("white");
    //sclera
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.rad / 2);
    strokeWeight(sight);
    //iris
    stroke(mood);
    point(this.pos.x, this.pos.y);
    strokeWeight(3);
    //pupil
    push();
    stroke("black");
    point(this.pos.x, this.pos.y);
    // line(this.pos.x, this.pos.y, nearestTarget.x, nearestTarget.y);
    pop();
    pop();
  }
}
