exports.up = function (knex) {
  return knex.schema.alterTable('pages', (table) => {
    table.string('section');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('pages', (table) => {
    table.dropColumns('section');
  });
};
