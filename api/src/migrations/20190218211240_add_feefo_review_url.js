exports.up = function(knex, Promise) {
  return knex.schema.alterTable('reviews', (t) => {
    t.string('feefo_url').defaultTo(null);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('reviews', (t) => {
    t.dropColumn('feefo_url');
  });
};
