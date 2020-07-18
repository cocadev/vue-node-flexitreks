exports.seed = function (knex) {
  return knex('booking_room_extras').del()
    .then(function () {
      return knex('booking_room_extras').insert([
        {
          booking_room_id: 1,
          cost: 500,
          quantity: 2,
          post: false,
          tour_room_extra_id: 1,
          accommodation_category_id: 1,
          room_type_id: 1,
          tour_room_extra_variation_ids: [1]
        }
      ]);
    });
};
