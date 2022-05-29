let population;
let berries;
let lime;
let environment;
// pos, wid, e_hei, rad, vel
let wormSpecies = {
  class: Worm,
  amount: 32,
  w_range: 200,
  h_range: 60,
  rad: 72,
};

function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(RADIUS);

  /*p5.js*/
  population = new Population(
    wormSpecies.class,
    wormSpecies.amount,
    wormSpecies.w_range,
    wormSpecies.h_range,
    wormSpecies.rad
  );
  berries = new FoodGroup("Berry", Food, "purple", true);
  lime = new FoodGroup("Lime", Food, "green", true);
  environment = new Environment(population, [berries]);
  environment.show();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  environment.update();
}
