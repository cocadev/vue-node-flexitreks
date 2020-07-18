exports.up = function (knex) {
  return knex.schema.alterTable('booking_room_extras', (t) => {
    t.integer('tour_room_extra_id')
      .references('id')
      .inTable('tour_room_extras')
      .notNull();

    t.integer('accommodation_category_id')
      .references('id')
      .inTable('accommodation_categories')
      .notNull();

    t.integer('room_type_id')
      .references('id')
      .inTable('room_types')
      .notNull();

    t.specificType('tour_room_extra_variation_ids', 'integer[]');
    
    t.index('tour_room_extra_id');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('booking_room_extras', (t) => {
    t.dropIndex('tour_room_extra_id');
    t.dropColumns('tour_room_extra_id', 'accommodation_category_id', 'room_type_id', 'tour_room_extra_variation_ids');
  });
};
