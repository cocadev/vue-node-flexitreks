exports.up = function (knex) {
  return knex.schema.alterTable('tours', (table) => {
    table.dropColumn('nights');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('tours', (table) => {
    table.integer('nights');
  });
};
