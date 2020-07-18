exports.seed = function (knex) {
  return knex('party_members').del()
    .then(function () {
      return knex('party_members').insert([
        {
          booking_id: 1,
          booking_room_id: 1,
          tour_bike_id: 1,
          title: 'Mr',
          first_name: 'Trys',
          last_name: 'Mudford'
        }
      ]);
    });
};
