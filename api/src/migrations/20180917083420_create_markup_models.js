exports.up = function (knex) {
  return knex.schema.hasTable('markup_models').then(exists => {
    if (!exists) {
      return knex.schema.createTable('markup_models', table => {
        table.increments('id').primary();
        table.timestamp('createdAt').defaultTo(knex.fn.now());
        table.string('name');

        table.integer('season_id')
          .references('id')
          .inTable('seasons')
          .notNull();
        
        table.index('season_id');
      });
    }
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('markup_models');
};
