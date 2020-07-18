exports.seed = function (knex) {
  return knex('tour_routes').del()
    .then(function () {
      return knex('tour_routes').insert([
        {
          tour_id: 1,
          name: 'From Mestre',
          tour_season_id: 1
        }
      ]);
    });
};
