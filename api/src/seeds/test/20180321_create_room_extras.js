exports.seed = function (knex) {
  return knex('tour_room_extras').del()
    .then(function () {
      return knex('tour_room_extras').insert([
        {
          name: 'Extra night in Constance',
          tour_id: 1,
          tour_season_id: 1
        }
      ]);
    })
    .then(function () {
      return knex('tour_room_extra_variations').del()
        .then(function () {
          return knex('tour_room_extra_variations').insert([
            {
              tour_room_extra_id: 1,
              cost: 180
            }
          ]);
        });
    });
};
