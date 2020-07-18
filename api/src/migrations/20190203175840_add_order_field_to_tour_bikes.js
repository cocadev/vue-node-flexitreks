exports.up = function (knex) {
  return knex.schema.alterTable('tour_bikes', (t) => {
    t.integer('order').defaultTo(0);
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('tour_bikes', (t) => {
    t.dropColumn('order');
  });
};
