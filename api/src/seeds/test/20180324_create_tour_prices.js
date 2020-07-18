exports.seed = function (knex) {
  return knex('tour_prices').del()
    .then(function () {
      return knex('tour_prices').insert([
        {
          tour_id: 1,
          tour_pricing_category_id: 1,
          cost: 500,
          tour_season_id: 1
        }
      ]);
    });
};
