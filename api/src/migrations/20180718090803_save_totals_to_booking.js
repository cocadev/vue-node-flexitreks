exports.up = function (knex) {
  return knex.schema.alterTable('bookings', (t) => {
    t.integer('total_rooms');
    t.integer('total_bikes');
    t.integer('total_room_extras');
    t.integer('total_party_extras');
    t.integer('total_reductions');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('bookings', (t) => {
    t.dropColumns('total_rooms', 'total_bikes', 'total_room_extras', 'total_party_extras', 'total_reductions');
  });
};
