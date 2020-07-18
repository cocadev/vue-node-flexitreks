exports.up = function (knex) {
  return knex.schema.hasTable('tour_weather').then(exists => {
    if (!exists) {
      return knex.schema.createTable('tour_weather', table => {
        table.increments('id').primary();
        table.timestamp('createdAt').defaultTo(knex.fn.now());

        table.integer('tour_id')
          .references('id')
          .inTable('tours')
          .notNull()
          .onDelete('cascade');

        table.integer('month');
        table.integer('temperature');
        table.integer('rainfall');

        table.index('tour_id');

      });
    }
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('tour_weather');
};
