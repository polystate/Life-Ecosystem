class Oscillator {
  constructor(obj) {
    this.ang = createVector(0, 0);
    this.vel = createVector(random(-0.05, 0.05), random(-0.05, 0.05));
    this.amp = createVector(random(obj.wid / 2), random(obj.hei / 2));
  }

  Oscillate() {
    this.ang.add(this.vel);
  }

  display() {
    let x = sin(this.ang.x) * this.amp.x;
    let y = sin(this.ang.y) * this.amp.y;

    push();
    translate(width / 2, height / 2);
    stroke(0);
    fill(175);
    line(0, this.hei / 2, 0, this.hei / 2 + this.hei);
    line(0, -this.hei / 2, 0, -this.hei / 2 + -this.hei);
    pop();
  }
}
