exports.up = function (knex) {
  return knex.schema.hasTable('boats').then(exists => {
    if (!exists) {
      return knex.schema.createTable('boats', table => {
        table.increments('id').primary();
        table.string('name');
      });
    }
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('boats');
};
