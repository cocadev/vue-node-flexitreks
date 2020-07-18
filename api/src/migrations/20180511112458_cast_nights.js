exports.up = function (knex) {
  return knex.schema.alterTable('tours', (table) => {
    table.specificType('nights', 'integer[]');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('tours', (table) => {
    table.dropColumn('nights');
  });
};
