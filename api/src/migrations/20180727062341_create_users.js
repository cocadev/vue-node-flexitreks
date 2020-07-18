exports.up = function (knex) {
  return knex.schema.hasTable('users').then(exists => {
    if (!exists) {
      return knex.schema.createTable('users', table => {
        table.increments('id').primary();
        table.timestamp('createdAt').defaultTo(knex.fn.now());

        table.string('email_address');
        table.string('password');

      });
    }
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('users');
};
