exports.up = function (knex) {
    return knex.schema.hasTable('categories').then(exists => {
      if (!exists) {
        return knex.schema.createTable('categories', table => {
          table.increments('id').primary();
          table.string('name');
          table.string('slug');
          table.string('description');
          table.string('filter_id');
          table.integer('media_id')
          .references('id')
          .inTable('media');
          table.integer('gallery_id')
          .references('id')
          .inTable('galleries');
        });
      }
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable('categories');
  };
  