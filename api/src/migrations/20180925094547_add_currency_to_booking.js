exports.up = function (knex) {
  return knex.schema.alterTable('bookings', (t) => {
    t.integer('currency_id')
      .references('id')
      .inTable('bookings');
    
    t.float('rate_at_booking', 6);
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('bookings', (t) => {
    t.dropColumns('currency_id', 'rate_at_booking');
  });
};
