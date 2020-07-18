exports.up = function (knex) {
  return knex.schema.hasTable('tour_specifications').then(exists => {
    if (!exists) {
      return knex.schema.createTable('tour_specifications', table => {
        table.increments('id').primary();
        table.timestamp('createdAt').defaultTo(knex.fn.now());

        table.integer('tour_id')
          .references('id')
          .inTable('tours')
          .notNull()
          .onDelete('cascade');

        table.text('price_includes');
        table.text('price_excludes');

        table.integer('tour_season_id')
          .references('id')
          .inTable('tour_seasons')
          .notNull();
        
        table.index('tour_id');
        table.index('tour_season_id');

      });
    }
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('tour_specifications');
};
