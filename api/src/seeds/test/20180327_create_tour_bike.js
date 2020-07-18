
exports.seed = function(knex) {
  return knex('tour_bikes').del()
    .then(function () {
      return knex('tour_bikes').insert([
        {
          bike_id: 1,
          tour_id: 1,
          tour_season_id: 1
        }
      ]);
    });
};
