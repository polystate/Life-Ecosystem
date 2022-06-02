function createSpeciesHive(
  _specie,
  amount,
  w_range,
  h_range,
  rad,
  hierarchy,
  _hive
) {
  let newSpecies = {
    class: _specie,
    amount: amount,
    w_range: w_range,
    h_range: h_range,
    rad: rad,
    hierarchy: hierarchy,
  };

  let newHive = new _hive(
    newSpecies.class,
    newSpecies.amount,
    newSpecies.w_range,
    newSpecies.h_range,
    newSpecies.rad,
    newSpecies.hierarchy
  );

  return newHive;
}
