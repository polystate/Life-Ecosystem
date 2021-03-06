class Hivemind {
  constructor(allBrains) {
    this.allBrains = allBrains;
    this.innovationNum = 0;
  }
  //try mutating the weights and biases here randomly to get them to move more dynamically, innovationNum no longer assigning
  get allNeurons() {
    return this.allBrains
      .map((brain) =>
        brain.inputNeurons.concat(
          brain.outputNeurons.concat(brain.hiddenNeurons)
        )
      )
      .flat();
  }
  // get allConnections() {
  //   // let connections = this.allNeurons.map((neuron) => neuron.connectedTo);
  //   // console.log(connections);
  //   // console.log(connections.map((path) => path));
  //   console.log(this.pathNeurons);
  // }
  get pathNeurons() {
    return this.allNeurons
      .filter((neuron) => neuron.connectedTo.length)
      .map((neuron) => neuron.connectedTo)
      .flat();
  }
  get allPaths() {
    return this.allBrains
      .map((brain) => brain.connections.map((connection) => connection.path))
      .flat();
  }
  get copiedPaths() {
    return this.allPaths.filter(
      (item, index) => this.allPaths.indexOf(item) !== index
    );
  }

  assignInnovation() {
    const uniquePaths = this.allPaths.filter(
      (path, index) => this.allPaths.indexOf(path) == index
    );
    for (let path of uniquePaths) {
      this.innovationNum++;
      let pathGroup = this.pathNeurons.filter((neuron) => neuron.path == path);
      pathGroup = pathGroup.map(
        (path) => (path.innovationNum = this.innovationNum)
      );
    }
  }

  checkNetworks() {
    this.assignInnovation();

    // let filterTwo = this.pathNeurons.filter((path) => path.innovationNum == 2);
    // filterTwo = filterTwo.map((innovationNum) => (innovationNum.weight = 0.2));
    // console.log(filterTwo);

    // this.updateCopies();
  }

  updateCopies() {
    if (this.isDuplicates()) {
      //store first instance of Neuron that matches copiedPath
      const instanceArr = [];
      for (let i = 0; i < this.copiedPaths.length; i++) {
        instanceArr.push(
          this.pathNeurons.find((neuron) => neuron.path == this.copiedPaths[i])
        );
      }

      //Loop through those first instances, loop through all connections, and if connection path is equal to one of the first instance paths, assign each connection object with the corresponding instance object to overwrite copies with the innovationNumber from instance
      for (let instance of instanceArr) {
        for (let connection of this.pathNeurons) {
          if (connection.path == instance.path) {
            Object.assign(connection, instance);
          }
        }
      }
    }
  }
  isDuplicates() {
    return new Set(this.allPaths).size !== this.allPaths.length;
  }
}
