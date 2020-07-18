exports.up = function (knex) {
  return knex.schema.hasTable('reviews').then(exists => {
    if (!exists) {
      return knex.schema.createTable('reviews', table => {
        table.increments('id').primary();
        table.timestamp('createdAt').defaultTo(knex.fn.now());
        table.integer('tour_id')
          .references('id')
          .inTable('tours')
          .onDelete('cascade');
        table.datetime('date');
        table.string('author');
        table.string('service_comment');
        table.string('product_comment');
        table.string('response');
        table.integer('service_rating');
        table.integer('product_rating');
        table.decimal('rating');
      });
    }
  }).then(() => knex.schema.alterTable('tours', (table) => {
    table.decimal('rating');
  }));
};

exports.down = function (knex) {
  return knex.schema.alterTable('tours', (table) => {
    table.dropColumn('rating');
  }).then(() => knex.schema.dropTable('reviews'));
};
