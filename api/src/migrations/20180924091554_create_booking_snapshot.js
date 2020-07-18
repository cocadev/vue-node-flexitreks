exports.up = function (knex) {
  return knex.schema.hasTable('booking_snapshots').then(exists => {
    if (!exists) {
      return knex.schema.createTable('booking_snapshots', table => {
        table.increments('id').primary();
        table.timestamp('createdAt').defaultTo(knex.fn.now());

        table.integer('booking_id')
          .references('id')
          .inTable('bookings')
          .notNull()
          .onDelete('cascade');
        
        table.text('snapshot');

        table.index('booking_id');

      });
    }
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('booking_snapshots');
};
