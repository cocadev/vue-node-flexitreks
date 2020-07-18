exports.up = function (knex) {
  return knex.schema.alterTable('tours', (table) => {
    table.specificType('related_tours', 'integer[]');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('tours', (table) => {
    table.dropColumn('related_tours');
  });
};
