exports.up = function (knex) {
  return knex.schema.alterTable('reviews', (t) => {
    t.string('feefo_id', 24);
    t.index('feefo_id');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('reviews', (t) => {
    t.dropIndex('feefo_id');
    t.dropColumns('feefo_id');
  });
};
