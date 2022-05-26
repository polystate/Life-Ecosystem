class Worm {
  constructor(pos, wid, hei, rad, col = 0, alpha = 30) {
    //variant or inherited traits
    this.pos = pos;
    this.wid = wid;
    this.hei = hei;
    this.rad = rad;
    //default traits or blank slate
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    //computed traits based on inherited
    this.mass = this.wid * this.hei;
    this.sight = sqrt((this.wid * this.hei) / this.rad);
    this.health = this.wid * this.hei;
    this.life = this.health / 2;
    this.col = col;
    this.alp = alpha;
    this.maxSpeed = 2; //lower the mass the higher the cap
    this.wanderTheta = PI / 2; //before pi/2
  }
  show() {
    push();
    rectMode(CENTER);
    noStroke();
    fill(this.col, this.alp);
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading());
    // if (this.health < 1000) {
    //   this.maxSpeed = 2;
    //   this.twitch(this.vel.heading());
    // } else {
    //   this.phenotype("gold");
    // }
    rect(0, 0, this.wid, this.hei, this.rad);
    pop();
    this.eye("lightblue", this.sight);
    // this.vision("lightblue", 20, 20);
    //gold looks really cool as an eye laser
    this.arm();
  }

  update() {
    this.boundaries();
    // this.pos.add(this.vel);
    if (this.hasHealth()) {
      this.applyForce(p5.Vector.random2D());
      this.vel.add(this.acc);
      this.pos.add(this.vel);
      this.vel.limit(this.maxSpeed);
    } else if (!this.hasHealth()) {
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
        this.wid--;
        this.hei--;
      }
    }
  }

  applyForce(forceVect) {
    let force = forceVect.copy();
    force.div(this.mass);
    this.acc.add(force);
  }

  phenotype(col) {
    push();
    let offset = 0;
    stroke(col);
    strokeWeight(5);
    point(this.hei, 0);
    point(this.hei, this.hei);
    point(this.hei, -this.hei);
    let vantagePoint = this.hei + this.wid / this.sight;
    point(vantagePoint, offset);
    point(offset, vantagePoint);
    point(-vantagePoint, offset);
    point(offset, -vantagePoint);
    pop();
  }

  wander() {
    push();
    let wanderPoint = this.vel.copy();
    // wanderPoint.setMag(random(width / 2, width));
    wanderPoint.setMag(width);
    //setMag to neared spotted food based on sight
    wanderPoint.add(this.pos);
    fill(255, 0, 0);
    // circle(wanderPoint.x, wanderPoint.y, 16);
    let wanderRadius = 50;
    noFill();
    // circle(wanderPoint.x, wanderPoint.y, wanderRadius);
    let theta = this.wanderTheta + this.vel.heading();
    let x = wanderRadius * cos(theta);
    let y = wanderRadius * sin(theta);
    fill(0, 255, 0);
    noStroke();
    wanderPoint.add(x, y);
    // circle(wanderPoint.x, wanderPoint.y, 16);
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

  hasHealth() {
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

  arm() {
    push();
    strokeWeight(2);
    stroke("black");
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading());
    line(0, this.hei / 2, 0, this.hei / 2 + this.hei);
    line(0, -this.hei / 2, 0, -this.hei / 2 + -this.hei);
    pop();
  }

  vision(mood, locX, locY) {
    push();
    strokeWeight(3);
    stroke(mood);
    line(this.pos.x, this.pos.y, locX, locY);
    pop();
  }

  eye(mood, sight) {
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
    pop();
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
