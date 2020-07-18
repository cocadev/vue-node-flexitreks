exports.up = function (knex) {
  return knex.schema.alterTable('bookings', (t) => {
    t.string('status').defaultTo('pending');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('bookings', (t) => {
    t.dropColumns('status');
  });
};
