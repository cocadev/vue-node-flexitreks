exports.seed = function (knex) {
  return knex('hotels').del()
    .then(function () {
      return knex('hotels').insert([
        {
          name: 'Villa Lola & Juan. Calle Farjarado',
          content: '<p>Tel: 0034 928 52 11 24</p>'
        }
      ]);
    }).then(function() {
      return knex('tour_hotels').del()
        .then(function () {
          return knex('tour_hotels').insert([
            {
              tour_id: 1,
              hotel_id: 1
            }
          ]);
        });
    });
};
