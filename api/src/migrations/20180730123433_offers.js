exports.up = function (knex) {
  return knex.schema.hasTable('offers').then(exists => {
    if (!exists) {
      return knex.schema.createTable('offers', table => {
        table.increments('id').primary();
        table.timestamp('createdAt').defaultTo(knex.fn.now());
        table.string('name');
        table.string('status');
        table.string('type');
        table.date('booking_window_start');
        table.date('booking_window_end');
        table.date('start_window_start');
        table.date('start_window_end');
        table.specificType('bike_ids', 'integer[]');
        table.integer('discount');
      });
    }
  })
  .then(() => {
    return knex.schema.hasTable('tour_offers').then(exists => {
      if (!exists) {
        return knex.schema.createTable('tour_offers', table => {
          table.integer('tour_id')
            .references('id')
            .inTable('tours')
            .notNull()
            .onDelete('cascade');

          table.integer('offer_id')
            .references('id')
            .inTable('offers')
            .notNull()
            .onDelete('cascade');

          table.unique(['tour_id', 'offer_id']);
        });
      }
    });
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('tour_offers').then(() => {
    return knex.schema.dropTable('offers');
  });
};
