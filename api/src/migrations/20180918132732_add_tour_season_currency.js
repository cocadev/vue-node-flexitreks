exports.up = function (knex) {
  return knex.schema.alterTable('tour_seasons', (table) => {
    table.integer('currency_id')
      .references('id')
      .inTable('currencies');

    table.integer('markup_model_id')
      .references('id')
      .inTable('markup_models');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('tour_seasons', (table) => {
    table.dropColumns('currency_id', 'markup_model_id');
  });
};
