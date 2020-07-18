
exports.up = function(knex, Promise) {
  return knex.schema.alterTable('tours', (table) => {
    table.integer('hero_id')
      .references('id')
      .inTable('media')
      .onDelete('cascade');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('tours', (table) => {
    table.dropColumn('hero_id');
  })
};
