exports.up = function (knex) {
  return knex.schema.hasTable('bikes').then(exists => {
    if (!exists) {
      return knex.schema.createTable('bikes', table => {
        table.increments('id').primary();
        table.string('name');
      });
    }
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('bikes');
};
