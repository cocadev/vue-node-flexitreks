exports.up = function (knex) {
  return knex.schema.alterTable('tour_bikes', (table) => {
    table.integer('tour_season_id')
      .references('id')
      .inTable('tour_seasons')
      .notNull();

    table.index('tour_season_id');
  }).then(function () {
    return knex.schema.alterTable('tour_room_extras', (table) => {
      table.integer('tour_season_id')
        .references('id')
        .inTable('tour_seasons')
        .notNull();

      table.index('tour_season_id');
    });
  }).then(function () {
    return knex.schema.alterTable('tour_party_extras', (table) => {
      table.integer('tour_season_id')
        .references('id')
        .inTable('tour_seasons')
        .notNull();

      table.index('tour_season_id');
    });
  }).then(function () {
    return knex.schema.alterTable('tour_reductions', (table) => {
      table.integer('tour_season_id')
        .references('id')
        .inTable('tour_seasons')
        .notNull();

      table.index('tour_season_id');
    });
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('tour_bikes', (table) => {
    table.dropIndex('tour_season_id');
    table.dropColumn('tour_season_id');
  }).then(function () {
    return knex.schema.alterTable('tour_room_extras', (table) => {
      table.dropIndex('tour_season_id');
      table.dropColumn('tour_season_id');
    });
  }).then(function () {
    return knex.schema.alterTable('tour_party_extras', (table) => {
      table.dropIndex('tour_season_id');
      table.dropColumn('tour_season_id');
    });
  }).then(function () {
    return knex.schema.alterTable('tour_reductions', (table) => {
      table.dropIndex('tour_season_id');
      table.dropColumn('tour_season_id');
    });
  });
};
