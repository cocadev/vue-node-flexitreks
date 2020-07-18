exports.seed = function (knex) {
  return knex('tour_pricing_categories').del()
    .then(function () {
      return knex('tour_pricing_categories').insert([
        {
          tour_id: 1,
          boat_id: 1,
          tour_route_id: 1,
          start: '2018-05-04',
          end: '2018-10-04',
          restricted_dates: ['2018-06-01'],
          restricted_days: [0, 1],
          tour_season_id: 1
        }
      ]);
    });
};
