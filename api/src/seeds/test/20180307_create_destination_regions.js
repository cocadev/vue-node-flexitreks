exports.seed = function (knex) {
  return knex('destination_regions').del()
    .then(function () {
      return knex('destination_regions').insert([
        {
          destination_id: 1,
          region_id: 1
        }
      ]);
    });
};
