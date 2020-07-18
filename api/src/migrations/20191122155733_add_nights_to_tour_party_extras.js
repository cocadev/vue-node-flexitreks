
exports.up = function(knex, Promise) {
  return knex.schema.alterTable('tour_party_extras', (t) => {
    t.integer('nights').defaultTo(0);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('tour_party_extras', (t) => {
    t.dropColumn('nights');
  });
};
