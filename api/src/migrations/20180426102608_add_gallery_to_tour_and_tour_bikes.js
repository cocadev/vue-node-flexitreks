exports.up = function (knex) {
  return knex.schema.alterTable('tours', (table) => {
    table.integer('gallery_id')
      .references('id')
      .inTable('galleries')
      .onDelete('cascade');
    
    table.integer('media_id')
      .references('id')
      .inTable('media')
      .onDelete('cascade');
  }).then(() => {
    return knex.schema.alterTable('tour_bikes', (table) => {
      table.integer('gallery_id')
        .references('id')
        .inTable('galleries')
        .onDelete('cascade');
    });
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('tours', (table) => {
    table.dropColumn('gallery_id');
    table.dropColumn('media_id');
  }).then(() => {
    return knex.schema.alterTable('tour_bikes', (table) => {
      table.dropColumn('gallery_id');
    });
  });
};
