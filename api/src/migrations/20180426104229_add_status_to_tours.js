exports.up = function (knex) {
  return knex.schema.alterTable('tours', (table) => {
    table.string('status').defaultTo('draft');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('tours', (table) => {
    table.dropColumn('status');
  });
};
