exports.up = function (knex) {
  return knex.schema.hasTable('pages').then(exists => {
    if (!exists) {
      return knex.schema.createTable('pages', table => {
        table.increments('id').primary();
        table.string('title');
        table.text('content');
        table.string('slug');
        table.integer('media_id')
          .references('id')
          .inTable('media')
          .onDelete('cascade');
        
        table.string('seo_title');
        table.text('seo_description');

      });
    }
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('pages');
};
