exports.up = function (knex) {
  return knex.schema.alterTable('bookings', (t) => {
    t.integer('total_deposit');
    t.integer('total_at_booking');
    t.uuid('uuid');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('bookings', (t) => {
    t.dropColumns('total_deposit', 'total_at_booking', 'uuid');
  });
};
