// let options = {
//   inputs: ["x", "y"],
//   ouputs: ["dist"],
//   task: "regression",
//   debug: true,
// };
// let neuralNetwork = ml5.neuralNetwork(options);

// function mousePressed() {
//   //gather data
//   let inputs = {
//     x: organism.vel.x,
//     y: organism.vel.y,
//   };
//   let target = {
//     dist: [organism.pos.dist(food.pos)],
//   };
//   neuralNetwork.addData(inputs, target.dist);
//   console.log(neuralNetwork.neuralNetworkData.data.raw);
// }

// function keyPressed() {
//   if (key === "t") {
//     neuralNetwork.normalizeData();
//     console.log(food.pos);

//     const trainingOptions = {
//       epochs: 50,
//     };
//     neuralNetwork.train(trainingOptions, whileTraining, finishedTraining);

//     function whileTraining(epoch, loss) {
//       console.log("Epoch: " + epoch + " Loss: " + loss);
//     }

//     function finishedTraining() {
//       console.log("finished training");
//     }
//   }
//   if (key === "p") {
//     console.log("predict");
//     function predict() {
//       const input = {
//         x: food.pos,
//       };
//       console.log(organism.pos.dist(food.pos));
//       neuralNetwork.predict(food.pos, handleResults);
//     }

//     function handleResults(error, result) {
//       if (error) {
//         console.error(error);
//         return;
//       }
//       let actualFoodDistance = organism.pos.dist(food.pos);
//       let predDistance = result[0].value;
//       let predictVect = createVector(actualFoodDistance, predDistance);
//       predictVect.normalize();
//       console.log("prediction: " + result[0].value);
//       console.log(predictVect);
//     }
//     predict();
//   }
// }
