exports.up = function (knex) {
  return knex.schema.alterTable('tour_itineraries', (table) => {
    table.integer('media_id')
      .references('id')
      .inTable('media')
      .onDelete('cascade');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('tour_itineraries', (table) => {
    table.dropColumn('media_id');
  });
};
