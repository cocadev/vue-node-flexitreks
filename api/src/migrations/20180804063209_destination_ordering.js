exports.up = function (knex) {
  return knex.schema.alterTable('destinations', (t) => {
    t.integer('order').defaultTo(0);
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('destinations', (t) => {
    t.dropColumn('order');
  });
};
