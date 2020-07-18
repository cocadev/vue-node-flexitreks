exports.up = function (knex) {
  return knex.schema.hasTable('seasons').then(exists => {
    if (!exists) {
      return knex.schema.createTable('seasons', table => {
        table.increments('id').primary();
        table.string('name');
      });
    }
  }).then(function() {
    return knex.schema.hasTable('tour_seasons').then(exists => {
      if (!exists) {
        return knex.schema.createTable('tour_seasons', table => {
          table.increments('id').primary();
          table.integer('tour_id')
            .references('id')
            .inTable('tours')
            .notNull()
            .onDelete('cascade');

          table.integer('season_id')
            .references('id')
            .inTable('seasons')
            .notNull()
            .onDelete('cascade');

          table.boolean('live').defaultTo(false);

          table.index(['tour_id', 'season_id']);
          table.index('tour_id');
        });
      }
    });
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('tour_seasons').then(function() {
    return knex.schema.dropTable('seasons');
  });
};
