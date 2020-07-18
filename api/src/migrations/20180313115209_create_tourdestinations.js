exports.up = function (knex) {
  return knex.schema.hasTable('tour_destinations').then(exists => {
    if (!exists) {
      return knex.schema.createTable('tour_destinations', table => {
        table.integer('tour_id')
          .references('id')
          .inTable('tours')
          .notNull()
          .onDelete('cascade');

        table.integer('destination_id')
          .references('id')
          .inTable('destinations')
          .notNull()
          .onDelete('cascade');

        table.unique(['tour_id', 'destination_id']);

      });
    }
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('tour_destinations');
};
