exports.seed = function (knex) {
  return knex('booking_rooms').del()
    .then(function () {
      return knex('booking_rooms').insert([
        {
          booking_id: 1,
          tour_price_id: 1,
          cost: 500
        }
      ]);
    });
};
