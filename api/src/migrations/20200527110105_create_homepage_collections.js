exports.up = function (knex) {
    return knex.schema.hasTable('homepage_collections').then(exists => {
      if (!exists) {
        return knex.schema.createTable('homepage_collections', table => {
          table.increments('id').primary();
          table.string('key');
          table.text('value');
        });
      }
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable('homepage_collections');
  };
  