exports.up = function (knex) {
  return knex.schema.hasTable('accommodation_categories').then(exists => {
    if (!exists) {
      return knex.schema.createTable('accommodation_categories', table => {
        table.increments('id').primary();
        table.string('name');
      });
    }
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('accommodation_categories');
};
