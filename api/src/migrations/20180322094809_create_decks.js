exports.up = function (knex) {
  return knex.schema.hasTable('decks').then(exists => {
    if (!exists) {
      return knex.schema.createTable('decks', table => {
        table.increments('id').primary();
        table.string('name');
      });
    }
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('decks');
};
