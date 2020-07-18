exports.up = function (knex) {
  return knex.schema.alterTable('bookings', (t) => {
    t.integer('total_charges').defaultTo(0);
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('bookings', (t) => {
    t.dropColumn('total_charges');
  });
};
