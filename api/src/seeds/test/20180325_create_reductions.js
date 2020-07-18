exports.seed = function (knex) {
  return knex('tour_reductions').del()
    .then(function () {
      return knex('tour_reductions').insert([
        {
          tour_id: 1,
          percent: 50,
          input_min: 18,
          input_quantity: 2,
          output_min: 5,
          output_max: 7,
          tour_season_id: 1
        }
      ]);
    });
};
