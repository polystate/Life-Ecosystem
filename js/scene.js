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
  visualizer("Insect");
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
}

function draw() {
  environment.update();
}

function mousePressed() {}

function visualizer(entity) {
  let diagram = appendVisualizer("div", "network");
  let header = appendVisualizer("h1", "network-header", diagram, entity);
  let container = appendVisualizer("div", "container", diagram);
  let general_stats = appendVisualizer("div", "general-stats", container);
  let brainVisualizer = appendVisualizer("div", "brain-visualizer", container);

  // let nodeLevel = nodeSection("div", "node-level", 3, brainVisualizer);
  // let nodes = nodeSection("div", "node", 4, nodeLevel);
  // let node = appendVisualizer("div", "node", nodeLevel);
  // let node2 = appendVisualizer("div", "node", nodeLevel);
  // let node3 = appendVisualizer("div", "node", nodeLevel);
  // let nodeText = appendVisualizer("p", "node-text", nodes, -0.25);
  // let nodeText2 = appendVisualizer("p", "node-text", nodes, "True");
  let node_sections = nodeSections(
    "div",
    "node-level",
    4,
    brainVisualizer,
    "node",
    [4, 3, 2, 1]
  );
}

//loop through numLevels
//for each level loop through n amount of nodes

function nodeSections(
  element,
  levelClass,
  numLevels,
  levelParent,
  nodeClass,
  numNodes
) {
  let nodeLevel;
  let nodes;
  for (let i = 0; i < numLevels; i++) {
    nodeLevel = appendVisualizer(element, levelClass, levelParent);
    for (let j = 0; j < numNodes[i]; j++) {
      nodes = appendVisualizer(element, nodeClass, nodeLevel);
    }
  }
  return nodeLevel;
}

function appendVisualizer(element, className, parent, entity) {
  let newElement = createElement(element, entity);
  newElement.class(className);
  newElement.parent(parent);
  return newElement;
}
