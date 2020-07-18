exports.up = function (knex) {
  return knex.schema.alterTable('pages', (table) => { 
    table.integer('banner_id')
      .references('id')
      .inTable('media')
      .onDelete('cascade');
    
    table.string('subtitle');
    table.text('overview');

    table.integer('overview_image_id')
      .references('id')
      .inTable('media')
      .onDelete('cascade');

    table.specificType('related_tours', 'integer[]');

    table.integer('destination_id')
      .references('id')
      .inTable('destinations')
      .onDelete('cascade');

    table.integer('region_id')
      .references('id')
      .inTable('regions')
      .onDelete('cascade');
    
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('pages', (table) => {
    table.dropColumns('banner_id', 'subtitle', 'overview', 'overview_image_id', 'related_tours', 'destination_id', 'region_id');
  });
};
