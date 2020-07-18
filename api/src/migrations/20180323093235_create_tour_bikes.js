exports.up = function (knex) {
  return knex.schema.hasTable('tour_bikes').then(exists => {
    if (!exists) {
      return knex.schema.createTable('tour_bikes', table => {
        table.increments('id').primary();

        table.integer('cost');

        table.integer('tour_id')
          .references('id')
          .inTable('tours')
          .notNull()
          .onDelete('cascade');

        table.integer('bike_id')
          .references('id')
          .inTable('bikes')
          .notNull()
          .onDelete('cascade');

        table.integer('nights');
        
        table.integer('boat_id')
          .references('id')
          .inTable('boats')
          .onDelete('cascade');

      });
    }
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('tour_bikes');
};
