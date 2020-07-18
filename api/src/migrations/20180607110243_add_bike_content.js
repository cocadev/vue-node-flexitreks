exports.up = function (knex) {
  return knex.schema.alterTable('bikes', (table) => {
    table.string('short_name');
    table.text('content');
    table.integer('gallery_id')
      .references('id')
      .inTable('galleries')
      .onDelete('cascade');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('bikes', (table) => {
    table.dropColumns('short_name', 'content', 'gallery_id');
  });
};
