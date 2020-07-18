
exports.up = function(knex, Promise) {
  return knex.schema.alterTable('tour_party_extras', (t) => {
    t.integer('boat_id').defaultTo(0);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('tour_party_extras', (t) => {
    t.dropColumn('boat_id');
  });
};
