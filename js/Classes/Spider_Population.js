class Spider_Population extends Population {
  constructor(sp, t, wr, hr, rad) {
    super(sp, t, wr, hr, rad);
  }
  update(foodGroupArr, prey) {
    let foodLocArr = foodGroupArr.map((foodArr) =>
      foodArr.arr.map((food) => food.pos)
    );
    for (let specie of this.arr) {
      if (!specie.isAlive()) {
        this.deceased.push(specie);
        this.arr.splice(this.arr.indexOf(specie), 1);
        this.total -= 1;
      }
      specie.show();

      specie.update(foodLocArr, this.arr, prey);
    }
  }
}
