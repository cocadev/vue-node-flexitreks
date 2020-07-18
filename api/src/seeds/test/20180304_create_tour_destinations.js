exports.seed = function (knex) {
  return knex('tour_destinations').del()
    .then(function () {
      return knex('tour_destinations').insert([
        {
          tour_id: 1,
          destination_id: 1
        },
        {
          tour_id: 1,
          destination_id: 2
        },
        {
          tour_id: 1,
          destination_id: 3
        }
      ]);
    });
};
