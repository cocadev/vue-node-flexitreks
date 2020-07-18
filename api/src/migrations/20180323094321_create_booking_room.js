exports.up = function (knex) {
  return knex.schema.hasTable('booking_rooms').then(exists => {
    if (!exists) {
      return knex.schema.createTable('booking_rooms', table => {
        table.increments('id').primary();

        table.integer('cost');

        table.integer('booking_id')
          .references('id')
          .inTable('bookings')
          .notNull()
          .onDelete('cascade');

        table.integer('tour_price_id')
          .references('id')
          .inTable('tour_prices')
          .notNull();

      });
    }
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('booking_rooms');
};
