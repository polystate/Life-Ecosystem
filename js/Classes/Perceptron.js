class Perceptron {
  constructor(numInputs) {
    this.inputs = new Array(numInputs);
    this.weights = new Array(numInputs);
    for (let i = 0; i < this.weights.length; i++) {
      this.weights[i] = random(-1, 1);
    }
  }
  feedforward(forces) {
    let sum = createVector(0, 0);
    console.log(this.weights);
    console.log(forces);
    for (let i = 0; i < this.weights.length; i++) {
      forces[i].mult(this.weights[i]);
      sum.add(forces[i]);
    }
    console.log(sum);
    return sum;
  }
  activate(sum) {
    if (sum > 0) return 1;
    else return -1;
  }
  train(forces, error) {
    let guess = this.feedforward(this.inputs);
    for (let i = 0; i < this.weights.length; i++) {
      weights[i] += error.x * forces[i].x;
      weights[i] += error.y * forces[i].y;
    }
  }
}

class Trainer {
  constructor() {
    this.inputs = new Array(3);
    this.answer;
  }

  train(x, y, a) {
    this.inputs[0] = x;
    this.inputs[1] = y;
    this.inputs[2] = 1;
    this.answer = a;
  }
}

function f(x) {
  return 2 * x + 1;
}
