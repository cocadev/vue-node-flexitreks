exports.up = function (knex) {
  return knex.schema.alterTable('tour_hotels', (table) => {
    table.integer('order').defaultTo(0);
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('tour_hotels', (table) => {
    table.dropColumn('order');
  });
};
