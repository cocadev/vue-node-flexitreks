exports.up = function (knex) {
  return knex.schema.hasTable('task_details').then(exists => {
    if (!exists) {
      return knex.schema.createTable('task_details', table => {
        table.increments('id').primary();
        table.timestamp('createdAt').defaultTo(knex.fn.now());
        table.date('date');
        table.text('details');
      });
    }
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('task_details');
};
