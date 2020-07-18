exports.up = function (knex) {
  return knex.schema.alterTable('tours', (table) => {
    table.string('slug');
  }).then(() => knex.schema.alterTable('regions', (table) => {
    table.string('slug');
  })).then(() => knex.schema.alterTable('destinations', (table) => {
    table.string('slug');
  }));
};

exports.down = function (knex) {
  return knex.schema.alterTable('tours', (table) => {
    table.dropColumn('slug');
  }).then(() => knex.schema.alterTable('regions', (table) => {
    table.dropColumn('slug');
  })).then(() => knex.schema.alterTable('destinations', (table) => {
    table.dropColumn('slug');
  }));
};
