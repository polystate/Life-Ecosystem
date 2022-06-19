let population;
let berries;
let lime;
let environment;

let insect = {
  class: Insect,
  amount: 1,
  w_range: 200,
  h_range: 60,
  rad: 72,
};

function setup() {
  let canvas = createCanvas(windowWidth / 2, windowHeight);
  canvas.class("canvas");

  rectMode(RADIUS);

  population = new Population(
    insect.class,
    insect.amount,
    insect.w_range,
    insect.h_range,
    insect.rad
  );

  berries = new FoodGroup("Berry", Food, "purple");
  lime = new FoodGroup("Lime", Food, "green");
  environment = new Environment([population], [berries, lime]);
  environment.show();
  Visualizer.display(population.arr[0]);

  // let insect_brain = population.arr[0].brain;
  // Visualizer.displayVisualizer("insect", insect_brain);
}

function draw() {
  environment.update();
}

// function mousePressed() {
//   let mouse = createVector(mouseX, mouseY);
//   for (let i = 0; i < population.arr.length; i++) {
//     if (mouse.dist(population.arr[i].pos) < population.arr[i].hei) {
//       Visualizer.appendDataNodes(population.arr[i].brain);
//     }
//   }
// }
