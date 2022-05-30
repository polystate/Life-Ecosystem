class Worm {
  constructor(pos, wid, hei, rad, maxMass, col = 0, alpha = 30) {
    //variant or inherited traits
    this.pos = pos;
    this.wid = wid;
    this.hei = hei;
    this.rad = rad;
    //default traits or blank slate
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    //computed traits based on inherited
    this.mass = ceil(this.wid * this.hei);
    this.sight = sqrt((this.wid * this.hei) / this.rad);
    this.energy = ceil(this.wid * this.hei);
    this.lifeforce = ceil(this.energy / 2);
    this.col = col;
    this.alp = alpha;
    this.maxSpeed = maxMass / this.mass; //divide max population/specie mass by entity's given mass, the smaller the worm, the faster it is by some constant, however be aware eyeball size has not been accounted for in mass, so creatures could evolve to having big eyes with no penalty
    this.maxForce = 0.1; //tied to health and ability to steer maybe
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

    this.arm();
  }

  update(foodLocArr, otherArr) {
    this.eye("lightblue", this.sight);
    this.applyBehaviors(foodLocArr, otherArr);
    if (this.hasEnergy()) {
      this.vel.add(this.acc);
      this.vel.limit(this.maxSpeed);
      this.pos.add(this.vel);
      this.acc.mult(0);
    } else if (!this.hasEnergy()) {
      fill(0, 255);
      if (this.rad > 1.5) {
        this.rad -= 0.01;
      }
      this.vel.setMag(0);
      this.lifeforce--;
      this.wid -= 0.01;
      this.hei -= 0.01;
    } else if (!this.isAlive()) {
      if (this.wid > 0 || this.hei > 0) {
        this.wid--;
        this.hei--;
      }
    }
  }

  applyBehaviors(foodLocArr, otherArr) {
    let separate = this.separate(otherArr);
    let seek = this.seek(this.getNearestTarget(foodLocArr));
    separate.mult(1);
    seek.mult(1.5);
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

  seek(targetVect) {
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
    return vectorArr[nearest];
  }

  applyForce(forceVect) {
    let force = forceVect.copy();
    // force.div(this.mass);
    this.acc.add(force);
  }

  hasEnergy() {
    this.energy--;
    return this.energy > 0;
  }

  isAlive() {
    return this.lifeforce > 0;
  }

  intersects(other) {
    let dist = this.pos.dist(other.pos);
    return dist < this.rad + other.rad;
  }

  reproduction(other) {
    let force = p5.Vector.sub(this.pos, other.pos);
    let distance = force.mag();
    distance = constrain(distance, 1, 2);
    force.normalize();
    let strength = (sqrt(other.mass) * this.rad) / sq(distance);

    force.mult(strength);
    other.applyForce(force);
  }

  resist(other, total) {
    //a distance constraint of 1,2 is for reproduction
    //add maybe?
    // let amount = norm(total, 5, 25);

    let force = p5.Vector.sub(this.pos, other.pos);
    // let distance = force.mag();
    // distance = constrain(distance, 5, 25);
    force.normalize();
    let strength = 1 / this.rad;

    force.mult(strength);
    this.applyForce(force);
  }

  arm(move) {
    push();
    strokeWeight(2);
    stroke("black");
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading());
    line(0, this.hei / 2, 0, this.hei / 2 + this.hei);
    line(0, -this.hei / 2, 0, -this.hei / 2 + -this.hei);
    pop();
  }

  vision(other) {
    //get a list of all objects in field of vision, goal.

    // circle is immediate vision, line is targeted vision, line must intersect with food in order to experience gravitational pull, if circle intersects with food then automatically goes for the food
    // console.log(other);
    let vacinity = sq(this.sight) + width / 3;

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
