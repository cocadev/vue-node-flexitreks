exports.up = function (knex) {
  return knex.schema.hasTable('galleries').then(exists => {
    if (!exists) {
      return knex.schema.createTable('galleries', table => {
        table.increments('id').primary();
        table.specificType('media', 'integer[]');
      });
    }
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('galleries');
};
