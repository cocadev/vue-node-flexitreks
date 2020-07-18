
exports.up = function(knex, Promise) {
  return knex.schema.alterTable('tour_reductions', (t) => {
    t.integer('child_calc_room')
      .references('id')
      .inTable('room_types')
      .onDelete('cascade');

    t.integer('child_calc_accommodation')
      .references('id')
      .inTable('accommodation_categories')
      .onDelete('cascade');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('tour_reductions', (t) => {
    t.dropColumns('child_calc_room');
    t.dropColumns('child_calc_accommodation');
  });
};
