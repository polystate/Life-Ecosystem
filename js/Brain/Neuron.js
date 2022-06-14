class Neuron {
  constructor(id, layer, type) {
    this.id = id;
    this.layer = layer;
    this.type = type;
    this.connectedTo = [];
    this.data = [];
  }
  connect(
    other,
    data,
    weight = Math.random() * 2 - 1,
    bias = Math.random() * 2 - 1
  ) {
    const connection = {
      path: `${this.id},${other.id}`,
      weight: weight,
      bias: bias,
      types: [this.type, other.type],
      innovationNum: 0,
      data: data,
      enabled: data * weight + bias > 0 ? true : false,
    };
    // if (this.type == "input") connection.enabled = true;
    this.connectedTo.push(connection);
    other.connectedTo.push(connection);
    return connection;
  }
}
