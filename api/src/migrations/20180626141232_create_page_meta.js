exports.up = function (knex) {
  return knex.schema.hasTable('page_meta').then(exists => {
    if (!exists) {
      return knex.schema.createTable('page_meta', table => {
        table.increments('id').primary();
        table.integer('page_id')
          .references('id')
          .inTable('pages')
          .notNull()
          .onDelete('cascade');

        table.string('key');
        table.text('value');

        table.index('page_id');
      });
    }
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('page_meta');
};
