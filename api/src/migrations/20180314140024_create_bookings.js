exports.up = function (knex) {
  return knex.schema.hasTable('bookings').then(exists => {
    if (!exists) {
      return knex.schema.createTable('bookings', table => {
        table.increments('id').primary();
        table.timestamp('createdAt').defaultTo(knex.fn.now());
        table.date('holiday_start_date').defaultTo(knex.fn.now());
        table.integer('total_cost');
        table.string('booking_reference');
        table.integer('customer_id')
          .references('id')
          .inTable('customers')
          .notNull();
        table.integer('tour_id')
          .references('id')
          .inTable('tours')
          .notNull();
        table.text('comments');
      });
    }
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('bookings');
};
