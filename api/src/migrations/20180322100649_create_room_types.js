exports.up = function (knex) {
  return knex.schema.hasTable('room_types').then(exists => {
    if (!exists) {
      return knex.schema.createTable('room_types', table => {
        table.increments('id').primary();
        table.string('name');
        table.integer('sleeps');
      });
    }
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('room_types');
};
