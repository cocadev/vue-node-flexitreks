
exports.up = function(knex) {
  return knex.schema.alterTable('tours', (table) => {
    table.integer('accommodation_gallery_id')
      .references('id')
      .inTable('galleries')
      .onDelete('set null');
  })
};

exports.down = function(knex) {
  return knex.schema.alterTable('tours', (table) => {
    table.dropColumn('accommodation_gallery_id');
  })
};
