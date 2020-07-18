exports.up = function (knex) {
  return knex.schema.hasTable('destination_regions').then(exists => {
    if (!exists) {
      return knex.schema.createTable('destination_regions', table => {
        table.integer('destination_id')
          .references('id')
          .inTable('destinations')
          .notNull()
          .onDelete('cascade');

        table.integer('region_id')
          .references('id')
          .inTable('regions')
          .notNull()
          .onDelete('cascade');

        table.unique(['destination_id', 'region_id']);

      });
    }
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('destination_regions');
};
