exports.seed = function (knex) {
  return knex('restaurants').del()
    .then(function () {
      return knex('restaurants').insert([
        {
          name: 'Costa Teguise',
          content: 'El Bocadito'
        }
      ]);
    }).then(function () {
      return knex('tour_restaurants').del()
        .then(function () {
          return knex('tour_restaurants').insert([
            {
              tour_id: 1,
              restaurant_id: 1
            }
          ]);
        });
    });
};
