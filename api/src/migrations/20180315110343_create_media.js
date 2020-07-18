exports.up = function (knex) {
  return knex.schema.hasTable('media').then(exists => {
    if (!exists) {
      return knex.schema.createTable('media', table => {
        table.increments('id').primary();
        table.timestamp('createdAt').defaultTo(knex.fn.now());
        table.text('url');
      });
    }
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('media');
};
