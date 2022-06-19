//update node text
const Visualizer = (() => {
  const display = (specie) => {
    const body = document.querySelector("body");
    createNewP5Canvas(specie, windowWidth / 2, windowHeight, "black", body);
  };

  const createNewP5Canvas = (
    specie,
    width,
    height,
    bgcolor,
    parentContainer
  ) => {
    let newSketch = function (p5) {
      p5.setup = function () {
        let newCanvas = p5.createCanvas(width, height);
        newCanvas.parent(parentContainer);
        p5.background(bgcolor);
      };
      p5.draw = function () {
        p5.header(specie.constructor.name, "white", "blue");
        p5.populationInfo(specie);
        p5.networkDisplay(specie);
      };
      p5.header = function (specie, color, lineColor) {
        p5.textSize(32);
        p5.textAlign(CENTER);
        p5.text(specie, width / 2, 50);
        p5.fill(color);

        p5.push();
        p5.stroke(lineColor);
        p5.line(0, 75, width, 75);
        p5.pop();
      };
      p5.populationInfo = function () {
        p5.push();
        p5.stroke("white");
        p5.line(0, height / 3, width, height / 3);
        p5.pop();
      };
      p5.networkDisplay = function (specie) {
        //draw nodes and neural network
        let outputNodesPos = displayNodes(
          specie,
          "output",
          "orange",
          height / 2
        );
        let inputNodesPos = displayNodes(
          specie,
          "input",
          "white",
          height / 2 + 200
        );
        // console.log(specie.brain.allPaths());

        // noLoop();

        let isConnected = specie.brain.connections.map(
          (connection) => connection.enabled
        );

        //connect nodes visually
        for (let i = 0; i < inputNodesPos.length; i++) {
          for (let j = 0; j < outputNodesPos.length; j++) {
            let currentColor = isConnected[i] ? "yellow" : bgcolor;
            p5.push();
            p5.stroke(currentColor);
            p5.strokeWeight(0.01);
            p5.line(
              inputNodesPos[i][0],
              inputNodesPos[i][1],
              outputNodesPos[j][0],
              outputNodesPos[j][1]
            );
            p5.pop();
          }
        }
      };

      const displayNodes = (specie, nodeType, nodeBG, startHeight) => {
        let nodePosArr = [];
        let startEndGap = 60;
        let nodes;
        switch (nodeType) {
          case "input":
            nodes = specie.brain.inputNeurons;
            break;
          case "output":
            nodes = specie.brain.outputNeurons;
            break;
        }

        let relativeWidth = (width - startEndGap) / nodes.length;

        let offset = (relativeWidth % nodes.length) + startEndGap;
        let x = 0;
        let y = startHeight;
        for (let i = 0; i < nodes.length; i++) {
          nodePosArr.push(
            createNode(
              x,
              y,
              relativeWidth - offset,
              nodeBG,
              round(nodes[i].data, 2),
              startEndGap
            )
          );
          x += relativeWidth;
        }
        return nodePosArr;
      };
      const createNode = (x, y, diam, charge, data, startEndGap) => {
        let currentColor = p5.map(data, -1, 1, 0, 255);
        p5.push();
        p5.fill(currentColor);
        p5.circle(x + diam / 2 + startEndGap, y, diam);
        // p5.fill(currentColor);
        // p5.textSize(diam / 4);
        // p5.text(data, x + diam / 2 + startEndGap, y);
        p5.pop();
        return [x + diam / 2 + startEndGap, y];
      };
    };
    new p5(newSketch);
  };
  return { display };
})();
