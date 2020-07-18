exports.up = function(knex) {
  return knex.schema.hasTable('destinations').then(exists => {
    if (!exists) {
      return knex.schema.createTable('destinations', table => {
        table.increments('id').primary();
        table.string('name');
        table.timestamp('createdAt').defaultTo(knex.fn.now());
      });
    }
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('destinations');
};
