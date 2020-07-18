exports.up = function (knex) {
  return knex.schema.hasTable('tour_itineraries').then(exists => {
    if (!exists) {
      return knex.schema.createTable('tour_itineraries', table => {
        table.increments('id').primary();
        table.text('title');
        table.text('content');
        table.integer('order').defaultTo(0);
        table.string('type').defaultTo('public');
        table.integer('tour_id')
          .references('id')
          .inTable('tours')
          .notNull()
          .onDelete('cascade');
        
        table.index(['tour_id', 'type']);
      });
    }
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('tour_itineraries');
};
