exports.up = function (knex) {
  return knex.schema.alterTable('tour_reductions', (t) => {
    t.integer('order').defaultTo(0);
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('tour_reductions', (t) => {
    t.dropColumn('order');
  });
};
