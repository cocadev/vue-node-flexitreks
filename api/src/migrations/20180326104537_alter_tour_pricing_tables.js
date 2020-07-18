exports.up = function (knex) {
  return knex.schema.alterTable('tour_prices', (table) => {
    table.integer('tour_season_id')
      .references('id')
      .inTable('tour_seasons')
      .notNull();

    table.index('tour_season_id');
  }).then(function () {
    return knex.schema.alterTable('tour_pricing_categories', (table) => {
      table.integer('tour_season_id')
        .references('id')
        .inTable('tour_seasons')
        .notNull();

      table.index('tour_season_id');
    });
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('tour_prices', (table) => {
    table.dropIndex('tour_season_id');
    table.dropColumn('tour_season_id');
  }).then(function () {
    return knex.schema.alterTable('tour_pricing_categories', (table) => {
      table.dropIndex('tour_season_id');
      table.dropColumn('tour_season_id');
    });
  });
};
