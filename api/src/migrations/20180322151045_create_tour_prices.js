exports.up = function (knex) {
  return knex.schema.hasTable('tour_prices').then(exists => {
    if (!exists) {
      return knex.schema.createTable('tour_prices', table => {
        table.increments('id').primary();
        table.timestamp('createdAt').defaultTo(knex.fn.now());

        table.integer('cost');

        table.integer('tour_id')
          .references('id')
          .inTable('tours')
          .notNull()
          .onDelete('cascade');

        table.integer('tour_pricing_category_id')
          .references('id')
          .inTable('tour_pricing_categories')
          .notNull()
          .onDelete('cascade');

        table.integer('room_type_id')
          .references('id')
          .inTable('room_types')
          .onDelete('cascade');

        table.integer('accommodation_category_id')
          .references('id')
          .inTable('accommodation_categories')
          .onDelete('cascade');
        
        table.integer('deck_id')
          .references('id')
          .inTable('decks')
          .onDelete('cascade');

        table.index('tour_id');

      });
    }
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('tour_prices');
};
