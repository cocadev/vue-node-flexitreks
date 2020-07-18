exports.up = function (knex) {
  return knex.schema.hasTable('admin_notes').then(exists => {
    if (!exists) {
      return knex.schema.createTable('admin_notes', table => {
        table.increments('id').primary();
        table.timestamp('createdAt').defaultTo(knex.fn.now());

        table.integer('user_id')
          .references('id')
          .inTable('users');

        table.text('note');
      });
    }
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('admin_notes');
};
