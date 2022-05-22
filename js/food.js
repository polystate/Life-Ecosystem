class Food {
  constructor(r, b, c) {
    this.rad = r;
    this.bound = b;
    this.col = c;
    this.eaten = false;
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
      this.respawn();
    }
  }
  respawn() {
    this.pos.x = random(this.bound, width - this.bound);
    this.pos.y = random(this.bound, height - this.bound);
    this.rad = random(15, 35);
  }
}
