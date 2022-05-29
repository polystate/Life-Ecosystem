class Food {
  constructor(r, b, c) {
    this.rad = r;
    this.bound = b;
    this.col = c;
    this.pos = createVector(
      random(this.bound, width - this.bound),
      random(this.bound, height - this.bound)
    );
  }
  show() {
    push();
    noStroke();
    fill(this.col);
    ellipse(this.pos.x, this.pos.y, this.rad);
    pop();
  }
  update() {
    if (this.rad <= 5) {
      // setTimeout(this.respawn.bind(this), 5000);
      this.respawn();
    }
  }
  attract(other) {
    let force = p5.Vector.sub(this.pos, other.pos);
    let distance = force.mag();
    // distance = constrain(distance, other.sight, this.rad);
    force.normalize();
    let strength = (sqrt(other.mass) * this.rad) / sq(distance);

    force.mult(strength);
    other.applyForce(force);
  }
  respawn() {
    this.pos.x = random(this.bound, width - this.bound);
    this.pos.y = random(this.bound, height - this.bound);
    this.rad = random(15, 35);
  }
}
