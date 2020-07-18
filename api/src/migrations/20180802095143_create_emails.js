exports.up = function (knex) {
  return knex.schema.hasTable('emails').then(exists => {
    if (!exists) {
      return knex.schema.createTable('emails', table => {
        table.increments('id').primary();
        table.timestamp('createdAt').defaultTo(knex.fn.now());

        table.integer('booking_id')
          .references('id')
          .inTable('bookings')
          .notNull();

        table.string('status');
        table.string('type');
        table.string('message_id');
        table.text('details');

      });
    }
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('emails');
};
