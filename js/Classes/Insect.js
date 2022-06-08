class Insect {
  constructor(pos, wid, hei, rad, maxMass, initial, col = 0, alpha = 30) {
    this.brain = new NeuralNetwork(6, 12, 6);
    this.initial = initial;
    this.pos = pos;
    this.wid = wid;
    this.hei = hei;
    this.rad = rad;
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.mass = ceil(this.wid * this.hei + this.rad);
    this.sight = map(this.rad, 36, 72, 6, 9);
    this.energy = 16;
    this.col = col;
    this.alp = alpha;
    this.maxSpeed = maxMass / this.mass;
    this.maxForce = 0.1;
    this.angle = 0;
    this.angV = 0;
    this.aAcc = 0.001;
    this.steer = 0;
    this.DNA = new DNA(this.wid, this.hei, this.rad, this.mass, this.sight);
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

  brainStartup(foodLocArr) {
    let nearestFood = this.getNearestTarget(foodLocArr).copy();

    nearestFood.normalize();

    let positionX = map(this.pos.x, 0, width, 0, 1);
    let positionY = map(this.pos.y, 0, height, 0, 1);

    let energyMap = map(this.energy, 0, this.energy, 0, 1);
    let maxSpeedMap = map(this.maxSpeed, 0, this.energy, 0, 1);
    let inputValues = [
      positionX,
      positionY,
      nearestFood.x,
      nearestFood.y,
      energyMap,
      maxSpeedMap,
    ];

    let brainMovement = this.brain.predict(inputValues);
    return brainMovement;
  }

  update(foodLocArr, otherArr, predator = null) {
    this.eye("lightblue", this.sight);

    this.randomWalk(this.brainStartup(foodLocArr));
    //after every generation, update the weights of the child based on crossover and parentA and parentB
    if (this.hasEnergy()) {
      this.lifespan++;
      this.vel.add(this.acc);
      this.vel.limit(this.maxSpeed);
      this.pos.add(this.vel);
      this.acc.mult(0);
    }
  }

  randomWalk(arr) {
    // console.log(this.brainWeights);

    let action = (x, y) => {
      this.applyForce(createVector(x, y));
    };
    if (arr[0] >= 0.5) {
      action(1, 0);
    }
    if (arr[1] >= 0.5) {
      action(-1, 0);
    }
    if (arr[2] >= 0.5) {
      action(0, 1);
    }
    if (arr[3] >= 0.5) {
      action(0, -1);
    }
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
    vectorArr = vectorArr.flat();
    let nearest = vectorArr.map((vect) => this.pos.dist(vect));
    nearest = nearest.indexOf(Math.min(...nearest));
    //if nearest matches field of vision, proceed, otherwise return null
    return vectorArr[nearest];
  }

  applyForce(forceVect) {
    if (!forceVect) return;
    let force = forceVect.copy();
    // force.div(this.mass);
    this.acc.add(force);
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
    triangle(200, 200, 80);
    pop();
  }

  vision(other) {
    //get a list of all objects in field of vision, goal.

    // circle is immediate vision, line is targeted vision, line must intersect with food in order to experience gravitational pull, if circle intersects with food then automatically goes for the food
    // console.log(other);
    let vacinity = pow(this.sight, 3);

    // ellipse(0, 0, vacinity);

    // let eyeCircle = this.pos.copy();
    let newValue = other - vacinity;
    // console.log(newValue);
    if (newValue < vacinity) {
      return true;
    }
    return false;
    /******** */
    //to check if circle intersects with food,  we simply get our dist between specie center point and food, we then subtract that by vacinity and get a new value. if that new value is less than vacinity, then circle intersects with food
    /******** */
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
