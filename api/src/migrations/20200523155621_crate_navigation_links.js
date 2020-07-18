exports.up = function (knex) {
    return knex.schema.hasTable('navigation_links').then(exists => {
      if (!exists) {
        return knex.schema.createTable('navigation_links', table => {
          table.increments('id').primary();
          table.integer('parent_id')
            .references('id')
            .inTable('navigations')
            .onDelete('cascade');

          table.string('column');
          table.string('title');
          table.string('url');  
          table.string('position');  
        });
      }
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable('navigation_links');
  };
  