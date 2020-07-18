exports.up = function (knex) {
  return knex.schema.hasTable('tour_routes').then(exists => {
    if (!exists) {
      return knex.schema.createTable('tour_routes', table => {
        table.increments('id').primary();
        table.timestamp('createdAt').defaultTo(knex.fn.now());

        table.integer('tour_id')
          .references('id')
          .inTable('tours')
          .notNull()
          .onDelete('cascade');

        table.string('name');

        table.index('tour_id');

      });
    }
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('tour_routes');
};
