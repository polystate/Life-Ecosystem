class Neuron {
  constructor(id, layer, type) {
    this.id = id;
    this.layer = layer;
    this.type = type;
    this.connectedTo = [];
    this.data = [];
    this.storage = [];
  }

  currentWeight() {
    if (!this.storage.length) {
      return Math.random() * 2 - 1;
    } else {
      return this.storage[0];
    }

    return Math.random() * 2 - 1;
  }

  currentBias() {
    if (!this.storage.length) {
      return Math.random() * 2 - 1;
    } else return this.storage[1];

    return Math.random() * 2 - 1;
  }

  connect(
    other,
    value,
    weight = this.currentWeight(),
    bias = this.currentBias()
  ) {
    const connection = {
      path: `${this.id},${other.id}`,
      weight: weight,
      bias: bias,
      types: [this.type, other.type],
      innovationNum: 0,
      currentValue: value * weight + bias,
      enabled: value * weight + bias > 0 ? true : false,
    };

    this.connectedTo.push(connection);
    other.connectedTo.push(connection);

    // if (this.storage.length <= 4) {
    //   this.storage.push(connection.weight, connection.bias);
    // } else {
    //   this.storage = [];
    // }
    // if (other.storage.length <= 4) {
    //   other.storage.push(connection.weight, connection.bias);
    // } else {
    //   other.storage = [];
    // }

    return connection;
  }
}
