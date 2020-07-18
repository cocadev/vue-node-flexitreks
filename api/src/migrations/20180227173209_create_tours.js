exports.up = function(knex) {
  return knex.schema.hasTable('tours').then(exists => {
    if (!exists) {
      return knex.schema.createTable('tours', table => {
        table.increments('id').primary();
        table.string('name');
        table.timestamp('createdAt').defaultTo(knex.fn.now());
      });
    }
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('tours');
};
