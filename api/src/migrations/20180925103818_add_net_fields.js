exports.up = function (knex) {
  return knex.schema.alterTable('bookings', (t) => {
    t.float('net_at_booking', 2);
  }).then(() => knex.schema.alterTable('booking_rooms', (t) => {
    t.float('net', 2);
  })).then(() => knex.schema.alterTable('booking_room_extras', (t) => {
    t.float('net', 2);
  })).then(() => knex.schema.alterTable('party_member_extras', (t) => {
    t.float('net', 2);
  }));
};

exports.down = function (knex) {
  return knex.schema.alterTable('bookings', (t) => {
    t.dropColumn('net_at_booking');
  }).then(() => knex.schema.alterTable('booking_rooms', (t) => {
    t.dropColumn('net');
  })).then(() => knex.schema.alterTable('booking_room_extras', (t) => {
    t.dropColumn('net');
  })).then(() => knex.schema.alterTable('party_member_extras', (t) => {
    t.dropColumn('net');
  }));
};
