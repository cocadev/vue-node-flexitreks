exports.up = function (knex) {
  return knex.schema.alterTable('tour_party_extras', (t) => {
    t.integer('order').defaultTo(0);
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('tour_party_extras', (t) => {
    t.dropColumn('order');
  });
};
