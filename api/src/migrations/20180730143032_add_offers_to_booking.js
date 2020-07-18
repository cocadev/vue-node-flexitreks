exports.up = function (knex) {
  return knex.schema.alterTable('bookings', (t) => {
    t.integer('total_offers');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('bookings', (t) => {
    t.dropColumns('total_offers');
  });
};
