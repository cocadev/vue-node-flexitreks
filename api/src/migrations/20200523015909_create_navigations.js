exports.up = function (knex) {
    return knex.schema.hasTable('navigations').then(exists => {
      if (!exists) {
        return knex.schema.createTable('navigations', table => {
          table.increments('id').primary();
          table.string('parent_category');
          table.string('column_1_title');
          table.string('column_2_title');
          table.string('column_3_title');  
        });
      }
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable('navigations');
  };
  