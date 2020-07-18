
exports.up = function(knex) {
  return knex.schema.alterTable('bikes', (table) => {
    table.integer('default_order').defaultTo(99);
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('bikes', (table) => {
    table.dropColumn('default_order');
  });
};
