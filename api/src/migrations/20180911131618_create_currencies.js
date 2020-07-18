exports.up = function (knex) {
  return knex.schema.hasTable('currencies').then(exists => {
    if (!exists) {
      return knex.schema.createTable('currencies', table => {
        table.increments('id').primary();
        table.timestamp('createdAt').defaultTo(knex.fn.now());
        table.string('name');
        table.string('symbol');
      });
    }
  })
    .then(() => knex.schema.hasTable('exchange_rates').then(exists => {
      if (!exists) {
        return knex.schema.createTable('exchange_rates', table => {
          table.float('rate', 6);

          table.integer('currency_id')
            .references('id')
            .inTable('currencies')
            .notNull();

          table.integer('season_id')
            .references('id')
            .inTable('seasons')
            .notNull();
          
          table.unique(['currency_id', 'season_id']);
        });
      }
    }));
};

exports.down = function (knex) {
  return knex.schema.dropTable('exchange_rates').then(() => knex.schema.dropTable('currencies'));
};
