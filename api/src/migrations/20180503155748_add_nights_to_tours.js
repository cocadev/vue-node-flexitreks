exports.up = function (knex) {
  return knex.schema.alterTable('tours', (t) => {
    t.integer('nights');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('tours', (t) => {
    t.dropColumn('nights');
  });
};
