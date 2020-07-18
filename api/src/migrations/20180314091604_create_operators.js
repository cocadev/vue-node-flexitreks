exports.up = function (knex) {
  return knex.schema.hasTable('operators').then(exists => {
    if (!exists) {
      return knex.schema.createTable('operators', table => {
        table.increments('id').primary();
        table.string('name');
        table.timestamp('createdAt').defaultTo(knex.fn.now());
      });
    }
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('operators');
};
