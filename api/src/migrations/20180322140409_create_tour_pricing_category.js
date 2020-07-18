exports.up = function (knex) {
  return knex.schema.hasTable('tour_pricing_categories').then(exists => {
    if (!exists) {
      return knex.schema.createTable('tour_pricing_categories', table => {
        table.increments('id').primary();
        table.timestamp('createdAt').defaultTo(knex.fn.now());

        table.integer('tour_id')
          .references('id')
          .inTable('tours')
          .notNull()
          .onDelete('cascade');

        table.date('start');
        table.date('end');
        table.integer('nights');
        table.boolean('guided');

        table.integer('boat_id')
          .references('id')
          .inTable('boats')
          .onDelete('cascade');

        table.integer('tour_route_id')
          .references('id')
          .inTable('tour_routes')
          .onDelete('cascade');
        
        table.specificType('specific_dates', 'date[]');
        table.specificType('restricted_dates', 'date[]');
        table.specificType('restricted_days', 'integer[]');

        table.index('tour_id');

      });
    }
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('tour_pricing_categories');
};
