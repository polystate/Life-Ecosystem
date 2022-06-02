let population;
let berries;
let lime;
let environment;
let spider;
// pos, wid, e_hei, rad, vel
let wormSpecies = {
  class: Worm,
  amount: 32,
  w_range: 200,
  h_range: 60,
  rad: 72,
};
let spiderSpecies = {
  class: Spider,
  amount: 12,
  w_range: 300,
  h_range: 120,
  rad: 180,
};

//115 to 200 for width, 30 to 60 for height

//maxSpeed 1/4
//3,450 to 12,000
//multiply two numbers to find k or constant for inverse correlation y = 1/x

//1 * 3,450 = 4 * 12,000
//3,450 - 48,000

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
  spider_pop = new Spider_Population(
    spiderSpecies.class,
    spiderSpecies.amount,
    spiderSpecies.w_range,
    spiderSpecies.h_range,
    spiderSpecies.rad
  );
  spider = new Spider(
    createVector(width / 2, height / 2),
    p5.Vector.random2D(),
    p5.Vector.random2D()
  );

  berries = new FoodGroup("Berry", Food, "purple", true);
  lime = new FoodGroup("Lime", Food, "green", true);
  environment = new Environment([population, spider_pop], [berries, lime]);
  environment.show();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  environment.update();
}
