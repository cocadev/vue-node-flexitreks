exports.up = function (knex) {
  return knex.schema.hasTable('tour_room_extra_variations').then(exists => {
    if (!exists) {
      return knex.schema.createTable('tour_room_extra_variations', table => {
        table.increments('id').primary();
        table.timestamp('createdAt').defaultTo(knex.fn.now());

        table.integer('tour_room_extra_id')
          .references('id')
          .inTable('tour_room_extras')
          .notNull()
          .onDelete('cascade');
        
        table.integer('cost').defaultTo(0);

        table.integer('accommodation_category_id')
          .references('id')
          .inTable('accommodation_categories')
          .onDelete('cascade');

        table.integer('room_type_id')
          .references('id')
          .inTable('room_types')
          .onDelete('cascade');
        
        table.date('start');
        table.date('end');
        table.specificType('specific_dates', 'date[]');
        table.specificType('restricted_dates', 'date[]');
        table.specificType('restricted_days', 'integer[]');

        table.index('tour_room_extra_id');
      });
    }
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('tour_room_extra_variations');
};
