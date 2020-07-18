exports.seed = function (knex) {
  return knex('tour_party_extras').del()
    .then(function () {
      return knex('tour_party_extras').insert([
        {
          name: 'Helmet hire',
          tour_id: 1,
          tour_season_id: 1
        }
      ]);
    })
    .then(function () {
      return knex('tour_party_extra_variations').del()
        .then(function () {
          return knex('tour_party_extra_variations').insert([
            {
              tour_party_extra_id: 1,
              cost: 12
            }
          ]);
        });
    });
};
