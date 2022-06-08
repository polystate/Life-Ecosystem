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
    stroke(40);
    strokeWeight(2);
    fill(this.col);
    ellipse(this.pos.x, this.pos.y, this.rad);
    pop();
  }
  ripen() {
    lerp(this.col, 0, 255, 50);
  }
  update() {
    this.show();
  }
  respawn() {
    this.pos.x = random(this.bound, width - this.bound);
    this.pos.y = random(this.bound, height - this.bound);
    this.rad = random(15, 35);
  }
}
