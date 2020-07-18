exports.up = function (knex) {
  return knex.schema.alterTable('tours', (table) => {
    table.integer('balance_due').defaultTo(70);
  }).then(() => knex.schema.alterTable('tour_seasons', (table) => {
    table.integer('deposit');
  }));
};

exports.down = function (knex) {
  return knex.schema.alterTable('tours', (table) => {
    table.dropColumn('balance_due');
  }).then(() => knex.schema.alterTable('tour_seasons', (table) => {
    table.dropColumn('deposit');
  }));
};
