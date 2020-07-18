exports.seed = function (knex) {
  return knex('tour_documentation').del()
    .then(function () {
      return knex('tour_documentation').insert([
        {
          map_id: 1,
          tour_id: 1,
          arrival: 'Arrival content',
          luggage: 'Luggage content',
          food: 'Food content',
          bike_details: 'Bike content'
        }
      ]);
    });
};
