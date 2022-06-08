let population;
let berries;
let lime;
let environment;

let insect = {
  class: Insect,
  amount: 8,
  w_range: 200,
  h_range: 60,
  rad: 72,
};

function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(RADIUS);

  population = new Population(
    insect.class,
    insect.amount,
    insect.w_range,
    insect.h_range,
    insect.rad
  );

  berries = new FoodGroup("Berry", Food, "purple", true);
  lime = new FoodGroup("Lime", Food, "green");
  environment = new Environment([population], [berries, lime]);
  environment.show();
}

function draw() {
  environment.update();
}
