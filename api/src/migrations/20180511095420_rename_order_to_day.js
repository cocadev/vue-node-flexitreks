exports.up = function (knex) {
  return knex.schema.alterTable('tour_itineraries', (table) => {
    table.renameColumn('order', 'day');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('tour_itineraries', (table) => {
    table.renameColumn('day', 'order');
  });
};
