class Worm {
  constructor(w, h, r, p, v, ac = 0, c = 0, t = 30, av = 0.05) {
    //what does it mean to be an organism
    this.wid = w;
    this.hei = h;
    this.rad = r;
    this.pos = p;
    this.vel = v;
    this.energy = 5000;
    this.life = this.energy / 2;
    this.acc = ac;
    this.col = c;
    this.alp = t;
    this.ang = this.vel.heading();
    this.angV = av; //aka this.spin
  }

  //organism actions and methods. //default color in fill is 0 for black, transparency set to 30
  show() {
    push();
    rectMode(CENTER);
    noStroke();
    fill(this.col, this.alp);
    translate(this.pos.x, this.pos.y);
    rotate(this.ang);
    rect(0, 0, this.wid, this.hei, this.rad);
    pop();

    //default content mood color. eyesight strength controlled by PUPIL SIZE or strokeWeight, blue being the happiest
    //what we need to figure out is what is its sign determined by, 8 is the current hardcoded value, but it should be determined by the parameters already thrown into the constructor, we also want its pupil to move around independently so that it can look around in any direction and have some degree of sight of what's happening behind it or ahead of it etc, this is better than sensors and is worth spending more time on
    this.eye("white", 8);
  }

  update() {
    this.boundaries();
    if (this.hasEnergy()) {
      this.pos.add(this.vel);
    } else {
      fill(0, 255);
      this.rad = 0;
      this.life--;
    }
    if (!this.isAlive()) {
      if (this.wid > 0 || this.hei > 0) {
        this.wid--;
        this.hei--;
      }
    }
  }

  hasEnergy() {
    this.energy--;
    return this.energy > 0;
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
