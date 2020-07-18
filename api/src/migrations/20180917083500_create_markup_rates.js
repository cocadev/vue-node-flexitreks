exports.up = function (knex) {
  return knex.schema.hasTable('markup_rates').then(exists => {
    if (!exists) {
      return knex.schema.createTable('markup_rates', table => {
        table.increments('id').primary();
        table.timestamp('createdAt').defaultTo(knex.fn.now());
        table.integer('commission');
        table.float('markup', 4);
        table.float('supplement_markup', 4);

        table.integer('markup_model_id')
          .references('id')
          .inTable('markup_models')
          .notNull();
        
        table.index('markup_model_id');
      });
    }
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('markup_rates');
};
