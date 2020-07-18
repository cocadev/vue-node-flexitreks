exports.up = function (knex) {
  return knex.schema.hasTable('options').then(exists => {
    if (!exists) {
      return knex.schema.createTable('options', table => {
        table.increments('id').primary();
        table.string('key');
        table.text('value');
      });
    }
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('options');
};
