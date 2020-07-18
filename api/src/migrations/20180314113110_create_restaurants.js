exports.up = function (knex) {
  return knex.schema.hasTable('restaurants').then(exists => {
    if (!exists) {
      return knex.schema.createTable('restaurants', table => {
        table.increments('id').primary();
        table.string('name');
        table.text('content');
        table.timestamp('createdAt').defaultTo(knex.fn.now());
      });
    }
  }).then(function () {
    return knex.schema.hasTable('tour_restaurants').then(exists => {
      if (!exists) {
        return knex.schema.createTable('tour_restaurants', table => {
          table.integer('tour_id')
            .references('id')
            .inTable('tours')
            .notNull()
            .onDelete('cascade');

          table.integer('restaurant_id')
            .references('id')
            .inTable('restaurants')
            .notNull()
            .onDelete('cascade');

          table.unique(['tour_id', 'restaurant_id']);

        });
      }
    });
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('tour_restaurants').then(function() {
    return knex.schema.dropTable('restaurants');
  });
};
