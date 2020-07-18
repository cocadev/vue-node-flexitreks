exports.up = function (knex) {
  return knex.schema.hasTable('tour_party_extra_variations').then(exists => {
    if (!exists) {
      return knex.schema.createTable('tour_party_extra_variations', table => {
        table.increments('id').primary();
        table.timestamp('createdAt').defaultTo(knex.fn.now());

        table.integer('tour_party_extra_id')
          .references('id')
          .inTable('tour_party_extras')
          .notNull()
          .onDelete('cascade');

        table.integer('cost').defaultTo(0);

        table.integer('accommodation_category_id')
          .references('id')
          .inTable('accommodation_categories')
          .onDelete('cascade');

        table.integer('bike_id')
          .references('id')
          .inTable('bikes')
          .onDelete('cascade');

        table.index('tour_party_extra_id');

        table.integer('min_pax');
        table.integer('max_pax');
      });
    }
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('tour_party_extra_variations');
};
