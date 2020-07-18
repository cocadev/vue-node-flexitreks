exports.up = function (knex) {
  return knex.schema.hasTable('tour_party_extras').then(exists => {
    if (!exists) {
      return knex.schema.createTable('tour_party_extras', table => {
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
  return knex.schema.dropTable('tour_party_extras');
};
