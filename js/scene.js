let population;
let berries;
let environment;

function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(RADIUS); //for collision
  //specieslClass, amount, width-range, height-range, vel-range, color, alpha
  population = new Population(Worm, 12, 200, 50, 1, 128, 255);
  berries = new Vegetation(Food, "purple");
  environment = new Environment(population, berries);
  environment.show();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(50);
  environment.update();
}
