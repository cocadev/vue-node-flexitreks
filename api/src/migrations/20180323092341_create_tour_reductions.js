exports.up = function (knex) {
  return knex.schema.hasTable('tour_reductions').then(exists => {
    if (!exists) {
      return knex.schema.createTable('tour_reductions', table => {
        table.increments('id').primary();
        table.timestamp('createdAt').defaultTo(knex.fn.now());

        table.integer('tour_id')
          .references('id')
          .inTable('tours')
          .notNull()
          .onDelete('cascade');

        table.integer('percent');
        table.integer('cost');
        table.integer('input_min');
        table.integer('input_max');
        table.integer('input_quantity');
        table.integer('output_min');
        table.integer('output_max');
        table.integer('output_quantity');

        table.index('tour_id');

      });
    }
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('tour_reductions');
};
