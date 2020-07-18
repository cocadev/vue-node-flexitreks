exports.up = function (knex) {
  return knex.schema.alterTable('tour_reductions', (table) => {
    table.integer('room_type_id')
      .references('id')
      .inTable('room_types')
      .onDelete('cascade');

    table.integer('deck_id')
      .references('id')
      .inTable('decks')
      .onDelete('cascade');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('tour_reductions', (table) => {
    table.dropColumn('room_type_id');
    table.dropColumn('deck_id');
  });
};
