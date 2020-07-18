exports.seed = function (knex) {
  return knex('tour_regions').del()
    .then(function () {
      return knex('tour_regions').insert([
        {
          tour_id: 1,
          region_id: 1
        }
      ]);
    });
};
