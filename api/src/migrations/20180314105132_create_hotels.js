exports.up = function (knex) {
  return knex.schema.hasTable('hotels').then(exists => {
    if (!exists) {
      return knex.schema.createTable('hotels', table => {
        table.increments('id').primary();
        table.string('name');
        table.text('content');
        table.timestamp('createdAt').defaultTo(knex.fn.now());
      });
    }
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('hotels');
};
