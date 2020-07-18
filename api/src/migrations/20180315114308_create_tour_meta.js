exports.up = function (knex) {
  return knex.schema.hasTable('tour_meta').then(exists => {
    if (!exists) {
      return knex.schema.createTable('tour_meta', table => {
        table.increments('id').primary();
        table.integer('tour_id')
          .references('id')
          .inTable('tours')
          .notNull()
          .onDelete('cascade');

        table.string('key');
        table.text('value');

        table.index('tour_id');
      });
    }
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('tour_meta');
};
