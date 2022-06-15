class Brain {
  constructor(inputCount, outputCount, hiddenArr = []) {
    Brain.neuronID = 1;
    Brain.currentLayer = 2;

    this.inputNeurons = [];
    this.outputNeurons = [];
    this.hiddenNeurons = [];
    this.connections = [];

    //Input Layer
    Brain.#createNeuronSet(
      this.inputNeurons,
      Brain.neuronID,
      Brain.neuronID + inputCount - 1,
      1,
      "input"
    );
    //Output Layer
    Brain.#createNeuronSet(
      this.outputNeurons,
      Brain.neuronID,
      Brain.neuronID + outputCount - 1,
      2 + hiddenArr.length,
      "output"
    );
    //Hidden Layer (if specified)
    if (hiddenArr) {
      for (let i = 0; i < hiddenArr.length; i++) {
        Brain.#createHiddenLayer(hiddenArr[i], this.hiddenNeurons);
        Brain.currentLayer++;
      }
    }
  }
  //Static methods for initialization
  static #createNeuronSet(arr, start, end, layer, type) {
    for (let i = start; i <= end; i++) {
      arr.push(new Neuron(i, layer, type));
      Brain.neuronID++;
    }
  }
  static #createHiddenLayer(hiddenLayer, arr) {
    Brain.#createNeuronSet(
      arr,
      Brain.neuronID,
      Brain.neuronID + hiddenLayer - 1,
      Brain.currentLayer,
      "hidden"
    );
  }

  get numLayers() {
    return this.outputNeurons[0].layer;
  }

  get allNeurons() {
    return this.inputNeurons
      .concat(this.outputNeurons)
      .concat(this.hiddenNeurons);
  }

  feedForward(data) {
    for (let i = 1; i < this.numLayers; i++) {
      const _layer = this.allNeurons.filter((neuron) => neuron.layer == i);
      const layer_ = this.allNeurons.filter((neuron) => neuron.layer == i + 1);
      this.connectLayers(_layer, layer_, data);
    }
    const onOrOff = this.connections.map((connection) => connection.enabled);
    return onOrOff;
  }

  connectLayers = (_layer, layer_, data) => {
    for (let i = 0; i < _layer.length; i++) {
      for (let j = 0; j < layer_.length; j++) {
        this.formConnection(_layer[i].id, layer_[j].id, data);
      }
    }
  };

  formConnection(neuronID, otherID, data) {
    //now the problem is every connection is the same data.
    //this is absurdly simple, there's 7 pieces of data, 7 input neurons, just apply each piece of data to each input neuron in order, only for input neurons first, why is this data being applied to output or hidden.
    //step one apply in order each data to each input neuron, forget about connections for right nows

    //now once input neurons have that data, when we make a new connection, we don't pass data, they form a connection first and have shared weight/bias. no data is passed to output neuron. step 2 is connect them all while data is only in input neuron layer 1.

    //it's fine to store the data in the connectionPath, neuron type "input" will keep that data static. the next layer will programatically do something to that data by multiplying it by the weight and such, thus storing the next new data value. so first have input layer 1 store the initial data values in their connectionObj. or maybe don't bother, just have output receive those values and do the multiplication

    //every new connection an input neuron makes, it stores that data that it already has in its connectedTo object.

    //store initial data in input neurons first
    for (let i = 0; i < data.length; i++) {
      this.inputNeurons[i].data = data[i];
    }

    //we update connection data by looping through all the input data which there is 7 total, then for each connectionObject we multiply the input data by the connectionObj's weight and add bias, that becomes the new data value of the connectionObj.

    const neuron = this.allNeurons.filter((n) => n.id === neuronID)[0];

    const other = this.allNeurons.filter((n) => n.id === otherID)[0];

    const pathCheck = String(neuron.id + "," + other.id);
    const neuronPaths = neuron.connectedTo.map((connection) => connection.path);
    const isConnected = neuronPaths.some((path) => path == pathCheck);

    if (!isConnected) {
      const connectionPath = neuron.connect(other, neuron.data);
      this.connections.push(connectionPath);
    }

    //next we make it so the outputNeurons receive the currentValue from the connection object, and then they multiply that currentValue by the next layer, rinse repeat until you get to the end, that's the algoritm

    // but wait, how do they continue to receive a continuous stream of input if the connections are closed by the checK? processingSpeed can be a gene, whoa? or is this reactionTime
    if (frameCount % 16 == 0) {
      this.connections = [];
      neuron.connectedTo = [];
      other.connectedTo = [];
    }
    //every time they receive new input, or we call processing speed of their brain, on certain amount of frames it updates information based on the information their sensors are picking up, the connections refresh

    //but don't refresh everything to a clean slate, keep the same bias/weight, just update the data every x amount of frames
  }
}

//**
//make a check that if you input a connection of neurons that don't exist it just returns undefined instead of throwing an error. just log "neurons not available."
//**
//NEAT algorithm

////take weights array for both put them on top of each other, and choose a random value of the first array or second array and you get some kind of crossover, this doesn't work for NEAT because we don't have fixed topologies or weight arrays like that. we have genomes, one genome is a set of genes. we have 'node' genes and 'connection' genes. in node genes we store the specific identification number of that node. we start at input so [1,2,3] go to output say [4,5] and then [6] which could be the one hidden in the middle in that specific order. after that each hidden neuron is going to have a new number. for the [connections] we have the node it is coming from and node it is going to (i.e. 1-6,2-6, 6-4) and each one is attached with another number called an "innovation number." innovation numbers are extremely important. an identification number or innovation number detetrmines when a connection has been created. each time you create a connection in ANY network, so if a network creates a new connection that doesn't exist in any genome, you're going to add a new connection with a new innovation number that is incremental over time for all networks. if that connection already exists then you do the same as that other network in your new connection.

// Crossover - with Crossover we only do the connection genes and from there we derive the node genes. all networks must have matching identification/innovation numbers or else the whole thing would fall apart. we also store the weight each connection and a 'boolean' value which says true or false on whether the connection is on or off, this is only used during the 'calculation' phase, and allows the network to turn on and off connections without actually deleting them, so the boolean just disables them with the boolean, doesn't delete. if both parents have same specific gene we just pick one of the genes, if only one of them has it, then we are going to take it from that parent. at the end we have disjoint genes and excess genes, excess genes don't have a matching counterpart in the other parent, so we say if parent 1 is fittter than parent 2, we would ignore the 'excess genes' of parent 2. the excess genes get inherited by the more fit parent.

// Mutation - we have several methods that get used, we mutate a link. so mutate_link just mutates a ran dom link betwee (-2,2) with a random weight. we also mutate_node or [inserting new hidden] which adds a random new node at any random connection, the weight of the first connection goes to 1 and second keeps the same. with new node we have new innovation number that is unique to all networks, this is going to be a new node in the global nodes array or whatever you want to call it. if we create a new_link it's possible we get an innovation number that already exists. mutate_enable_disable we get a percentage of connections and we choose some connections randomlyy, and like a switch we just turn them on or off. weight_shifting we take a weight and multiply it by a number between 0 and 2 or how we want to implement it.

// Selection - this is the hardest part. Let's say we have 9 different genomes. this is where we do speciating. each of the 9 has a score, an overall score for their connection genes, etc. we go through all the species and see how good it matches in every genome. if one of the genomes doesn't have matches then we create a new 'species' from that genome and so forth. we then go to the second genome, and we get the [difference] between the two genomes, and if it is at a certain threshold, we add it to that species. then we calculate the distance from the third genome to the first genome and so on. after this is done, we kill some of the 'genomes.' say we want 50% genomes killed. for each species we kill exactly 50%, but the good thing is that a genome that has been really bad can survive the selection. but if one of the genomes survives, we keep some of its qualities to ensure diversity in the ecosystem, so some bad scores should survive, so we have different topologies in the next generation. some of these bad genomes could BECOME good in future circumstances, basically we allow it to survive and give it a chance to improve., but maybe you need some innovation, a good innovation could spawn from a bad genome score over time, whereas the problem with previous genetic algorithms was removing all bad genomes which isn't efficient.

//all of the DNA of a living organism is its genome so don't get the definitions confused.

// this.inputNeurons = new Array(inputCount).fill(
//   new Neuron(inputCount, "input")
// );
// this.outputNeurons = new Array(outputCount).fill(
//   new Neuron(outputCount, "output")
// );

// const occurrences = [5, 5, 5, 2, 2, 2, 2, 2, 9, 4].reduce(function (acc, curr) {
//   return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
// }, {});
//console.log(occurrences) // => {2: 5, 4: 1, 5: 3, 9: 1}
