let population;
let berries;
let lime;
let environment;

function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(RADIUS); //for collision
  //specieslClass, amount, width-range, height-range, vel-range, color, alpha
  population = new Population(Worm, 8, 200, 50, 1, 128, 255);
  berries = new FoodGroup("Berry", Food, "purple");
  lime = new FoodGroup("Lime", Food, "green");
  environment = new Environment(population, [berries, lime]);
  environment.show();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(50);
  environment.update();
}
