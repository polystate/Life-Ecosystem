class Beetle extends Insect {
  constructor(pos, wid, hei, rad, maxMass, sight, energy) {
    super(pos, wid, hei, rad, maxMass, sight, energy);
    this.energy = 5;
  }

  show() {
    push();
    rectMode(CENTER);
    noStroke();
    fill("black");

    this.pos.x = constrain(this.pos.x, this.wid / 2, width - this.wid / 2);
    this.pos.y = constrain(this.pos.y, this.wid / 2, height - this.wid / 2);
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading());
    ellipse(0, 0, this.wid, this.hei, this.rad);
    // quad(38, 31, 86, 20, 69, 63, 30, 76);

    // strokeWeight(1);
    // stroke("white");
    // this.vision();

    pop();
    // this.eyes();
    push();
    translate(this.pos.x, this.pos.y);
    stroke(20);
    strokeWeight(3);
    let diag = sqrt(sq(this.wid) + sq(this.hei));
    let distFromRad = diag / 2;
    let dx = distFromRad * cos(this.vel.heading());
    let dy = distFromRad * cos(this.vel.heading());
    rotate(PI / 2);

    this.arm(0.02, createVector(38, 31));
    this.arm(0.02, createVector(noise(-dx, dx), noise(-dy, dy)));
    this.arm(0.02, createVector(noise(dx, dy), noise(-dx, -dy)));
    point(this.pos.x - this.hei / 2, this.pos.y + distFromRad);
    point(this.pos.x + distFromRad, this.pos.y - this.hei / 2);
    rotate(this.vel.heading());
    pop();
  }

  update(foodLocArr, otherArr, prey) {
    super.update(foodLocArr, otherArr, prey);
  }

  applyBehaviors(foodLocArr, otherArr, prey = null) {
    let separate = this.separate(otherArr);
    let seek = this.seek(this.getNearestTarget(foodLocArr));

    if (prey.arr.length) {
      let pursue = this.pursue(prey.arr[0], 5 / this.energy);
      pursue.mult(1.6); // before 1.6

      this.applyForce(pursue);
    }
    separate.mult(1);

    if (foodLocArr[0].length) {
      seek.mult(1.5);
    }
    this.applyForce(separate);
    this.applyForce(seek);
  }

  pursue(prey, predict) {
    let target = prey.pos.copy();
    let prediction = prey.vel.copy();
    prediction.mult(predict);
    target.add(prediction);

    return this.seek(target);
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

  arm(movement, originVect) {
    let armAng = createVector(0, 0);
    let armVel = createVector(
      random(-movement, movement),
      random(-movement, movement)
    );
    let armAmp = createVector(random(-this.hei / 2), random(this.hei / 2));

    push();
    armAng.add(armVel);
    let floatX = cos(armAng.x) * armAmp.x;
    let floatY = cos(armAng.y) * armAmp.y;
    this.angle += this.angV;
    this.angV += this.aAcc;
    this.aAcc = random(-movement, movement);
    this.angV = constrain(this.angV, -movement, movement);
    strokeWeight(2);
    stroke("black");
    translate(originVect.x, originVect.y);
    rotate(this.angle);
    rotate(armAng);
    // line(floatX, armAmp.y, floatY, armAmp.y + this.hei);
    // line(floatX, armAmp.x, floatY, armAmp.x + -this.hei);
    noFill();
    // stroke(255, 102, 0);
    curve(5, 26, 0, 5, 26, 0, 73, 24, 0, 73, 61, 0);
    stroke(0);
    curve(5, 26, 0, 73, 24, 0, 73, 61, 0, 15, 65, 0);
    // stroke(255, 102, 0);
    curve(73, 24, 0, 73, 61, 0, 15, 65, 0, 15, 65, 0);
    pop();
  }

  eyes() {
    let offset = 0;
    for (let i = 0; i < 8; i++) {
      this.eye(offset);
      offset += this.sight * 2;
    }
  }

  eye(offset) {
    push();

    fill("white");
    //sclera
    noStroke();
    ellipse(this.pos.x + offset, this.pos.y, this.rad / 8);
    strokeWeight(1);
    //iris
    // stroke("red");
    point(this.pos.x, this.pos.y);
    strokeWeight(4);
    //pupil
    push();
    // stroke("red");
    point(this.pos.x, this.pos.y);
    // line(this.pos.x, this.pos.y, nearestTarget.x, nearestTarget.y);
    pop();
    pop();
  }
}
