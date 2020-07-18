exports.up = function(knex) {
    return knex.schema.alterTable('categories', (table) => {
      table.text('description').alter()
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.alterTable('categories', (table) => {
      table.dropColumn('description');
    });
  };
  