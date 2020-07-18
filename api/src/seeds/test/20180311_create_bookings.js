exports.seed = function (knex) {
  return knex('bookings').del()
    .then(function () {
      return knex('bookings').insert([
        {
          id: 1,
          total_cost: 1200,
          booking_reference: '1234',
          customer_id: 1,
          tour_id: 1,
          comments: 'A comment',
          tour_season_id: 1
        }
      ]);
    });
};
