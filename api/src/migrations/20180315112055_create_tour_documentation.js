exports.up = function (knex) {
  return knex.schema.hasTable('tour_documentation').then(exists => {
    if (!exists) {
      return knex.schema.createTable('tour_documentation', table => {
        table.increments('id').primary();
        table.timestamp('createdAt').defaultTo(knex.fn.now());
        table.integer('map_id')
          .references('id')
          .inTable('media')
          .onDelete('cascade');
        
        table.integer('tour_id')
          .references('id')
          .inTable('tours')
          .notNull()
          .onDelete('cascade');
        
        table.text('arrival');
        table.text('luggage');
        table.string('luggage_pickup');
        table.string('luggage_delivery');
        table.text('food');
        table.text('bike_details');

        table.unique('tour_id');
      });
    }
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('tour_documentation');
};
