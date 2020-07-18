exports.up = function (knex) {
  return knex.schema.alterTable('destinations', (table) => {
    table.string('description');
    table.integer('media_id')
      .references('id')
      .inTable('media')
      .onDelete('cascade');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('destinations', (table) => {
    table.dropColumns('description', 'media_id');
  });
};
