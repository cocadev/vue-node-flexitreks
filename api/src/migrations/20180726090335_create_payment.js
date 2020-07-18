exports.up = function (knex) {
  return knex.schema.hasTable('payments').then(exists => {
    if (!exists) {
      return knex.schema.createTable('payments', table => {
        table.increments('id').primary();
        table.timestamp('createdAt').defaultTo(knex.fn.now());

        table.integer('booking_id')
          .references('id')
          .inTable('bookings')
          .notNull();

        table.decimal('amount');
        table.string('status');
        table.string('tx_code');
        table.string('sagepay_reference');
        
      });
    }
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('payments');
};
