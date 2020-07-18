exports.seed = function (knex) {
  return knex('seasons').del()
    .then(function () {
      return knex('seasons').insert([
        {
          id: 1,
          name: '2018'
        }
      ]);
    }).then(function () {
      return knex('tour_seasons').del()
        .then(function () {
          return knex('tour_seasons').insert([
            {
              tour_id: 1,
              season_id: 1,
              live: true
            }
          ]);
        });
    });
};
