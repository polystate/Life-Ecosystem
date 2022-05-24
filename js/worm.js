class Worm {
  constructor(pos, wid, hei, vel, rad, col = 0, alpha = 30) {
    //core traits
    this.pos = pos;
    this.wid = wid;
    this.hei = hei;
    this.vel = vel;
    this.rad = rad;

    this.wanderTheta = 360; //before pi/2

    //additional traits
    this.acc = p5.Vector.random2D();
    this.area = this.wid * this.hei;
    this.perim = 2 * (this.wid + this.hei);
    this.sight = sqrt(this.area / this.rad);
    this.health = this.area * 2;
    this.life = this.health / 2;
    // this.acc.mult(random(1.5));
    this.col = col;
    this.alp = alpha;
    this.maxSpeed = 1.5;
    this.angV = p5.Vector.random2D();
    this.angV.mult(random(-3, 3), random(-3, 3));
  }
  show() {
    push();
    rectMode(CENTER);
    noStroke();
    fill(this.col, this.alp);
    translate(this.pos.x, this.pos.y);
    let degrees = this.vel.heading();
    this.angV.mult(this.vel);
    rotate(degrees);
    if (this.health < 1000) {
      this.maxSpeed = 2;
      // this.twitch(degrees);
    }
    // else {
    //   this.phenotype("gold");
    // }

    rect(0, 0, this.wid, this.hei, this.rad);
    pop();

    //default content mood color. eyesight strength controlled by PUPIL SIZE or strokeWeight, blue being the happiest
    //what we need to figure out is what is its sign determined by, 8 is the current hardcoded value, but it should be determined by the parameters already thrown into the constructor, we also want its pupil to move around independently so that it can look around in any direction and have some degree of sight of what's happening behind it or ahead of it etc, this is better than sensors and is worth spending more time on
    this.eye("white", this.sight);
  }

  update() {
    //any CHANGES in animation when it dies to its eye or color has to be done through _Population
    this.boundaries();
    this.pos.add(this.vel);
    if (this.hasEnergy()) {
      // this.applyForce();
      this.vel.add(this.acc);
      this.pos.add(this.vel);

      this.wander();
      this.acc.limit(this.maxSpeed);
      this.vel.limit(this.maxSpeed);
    } else if (!this.hasEnergy()) {
      fill(0, 255);
      if (this.rad > 1.5) {
        this.rad -= 0.01;
      }
      this.vel.setMag(0);
      this.life--;
      this.wid -= 0.01;
      this.hei -= 0.01;
    } else if (!this.isAlive()) {
      if (this.wid > 0 || this.hei > 0) {
        // console.log(this + " is dead.");
        this.wid--;
        this.hei--;
      }
    }
  }

  phenotype(col) {
    push();
    let offset = 0;
    stroke(col);
    strokeWeight(5);
    point(this.hei, 0); //on its head
    point(this.hei, this.hei);
    point(this.hei, -this.hei);
    let vantagePoint = this.hei + this.wid / this.sight; //before this was * degrees, + this.rad is interesting because it reflects their vision/vantagePoint, this.rad or their vantage point should shift over time as a variable absed on direction they are looking and eyesight
    point(vantagePoint, offset);
    point(offset, vantagePoint);
    point(-vantagePoint, offset);
    point(offset, -vantagePoint);
    pop();
  }

  applyForce(vect) {
    // let force = p5.Vector.random2D();
    this.acc.add(vect);
  }

  wander() {
    push();
    let wanderPoint = this.vel.copy();
    // wanderPoint.setMag(random(width / 2, width));
    wanderPoint.setMag(width);
    //setMag to neared spotted food based on sight
    wanderPoint.add(this.pos);
    fill(255, 0, 0);
    circle(wanderPoint.x, wanderPoint.y, 16);

    let wanderRadius = 50;
    noFill();
    circle(wanderPoint.x, wanderPoint.y, wanderRadius);

    let theta = this.wanderTheta + this.vel.heading();
    let x = wanderRadius * cos(theta);
    let y = wanderRadius * sin(theta);
    fill(0, 255, 0);
    noStroke();
    wanderPoint.add(x, y);
    circle(wanderPoint.x, wanderPoint.y, 16);

    let steer = wanderPoint.sub(this.pos);

    let displaceRange = 0.3;
    this.wanderTheta += random(-displaceRange, displaceRange);
    this.acc.add(steer);
    pop();
  }

  twitch() {
    push();
    let twitchVect = p5.Vector.random2D();
    twitchVect.mult(this.health);
    let averageTwitch = twitchVect.x + twitchVect.y / 2;
    degrees += random(-averageTwitch, averageTwitch);
    this.acc.add(twitchVect);
    pop();
  }

  hasEnergy() {
    this.health--;
    return this.health > 0;
  }

  isAlive() {
    return this.life > 0;
  }

  intersects(other) {
    let dist = this.pos.dist(other.pos);
    return dist < this.rad + other.rad;
  }

  eye(mood, sight) {
    push();
    rectMode(CENTER);
    fill(mood);
    ellipse(this.pos.x, this.pos.y, this.rad / 2);
    strokeWeight(sight);
    point(this.pos.x, this.pos.y);
    pop();
  }

  boundaries() {
    if (this.pos.x >= width) {
      this.pos.x = 0;
    } else if (this.pos.x <= 0) {
      this.pos.x = width;
    }
    if (this.pos.y <= 0) {
      this.pos.y = height;
    } else if (this.pos.y >= height) {
      this.pos.y = 0;
    }
  }
}
