exports.up = function (knex) {
  return knex.schema.alterTable('bookings', (table) => {
    table.integer('tour_season_id')
      .references('id')
      .inTable('tour_seasons')
      .notNull();

    table.index('tour_season_id');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('bookings', (table) => {
    table.dropIndex('tour_season_id');
    table.dropColumn('tour_season_id');
  });
};
