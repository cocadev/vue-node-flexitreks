exports.up = function (knex) {
  return knex.schema.hasTable('tour_hotels').then(exists => {
    if (!exists) {
      return knex.schema.createTable('tour_hotels', table => {
        table.integer('tour_id')
          .references('id')
          .inTable('tours')
          .notNull()
          .onDelete('cascade');

        table.integer('hotel_id')
          .references('id')
          .inTable('hotels')
          .notNull()
          .onDelete('cascade');

        table.unique(['tour_id', 'hotel_id']);

      });
    }
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('tour_hotels');
};
