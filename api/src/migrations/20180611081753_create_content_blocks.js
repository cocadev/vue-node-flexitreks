exports.up = function (knex) {
  return knex.schema.hasTable('content_blocks').then(exists => {
    if (!exists) {
      return knex.schema.createTable('content_blocks', table => {
        table.increments('id').primary();
        table.text('content');
        table.integer('order').defaultTo(0);
        table.integer('page_id')
          .references('id')
          .inTable('pages')
          .notNull()
          .onDelete('cascade');
        
        table.integer('media_id')
          .references('id')
          .inTable('media')
          .notNull()
          .onDelete('cascade');

        table.index('page_id');
      });
    }
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('content_blocks');
};
