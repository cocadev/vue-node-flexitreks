exports.up = function (knex) {
  return knex.schema.hasTable('tour_regions').then(exists => {
    if (!exists) {
      return knex.schema.createTable('tour_regions', table => {
        table.integer('tour_id')
          .references('id')
          .inTable('tours')
          .notNull()
          .onDelete('cascade');

        table.integer('region_id')
          .references('id')
          .inTable('regions')
          .notNull()
          .onDelete('cascade');

        table.unique(['tour_id', 'region_id']);

      });
    }
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('tour_regions');
};
