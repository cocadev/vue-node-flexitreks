exports.up = function (knex) {
  const tours = knex.schema.alterTable('tours', (table) => {
    table.dropForeign('media_id');
    table.foreign('media_id')
      .references('id')
      .inTable('media')
      .onDelete('set null');
    table.dropForeign('hero_id');
    table.foreign('hero_id')
      .references('id')
      .inTable('media')
      .onDelete('set null');      
  });
  const tour_documentation = knex.schema.alterTable('tour_documentation', (table) => {
    table.dropForeign('map_id');
    table.foreign('map_id')
      .references('id')
      .inTable('media')
      .onDelete('set null');    
  });
  const tour_itineraries = knex.schema.alterTable('tour_itineraries', (table) => {
    table.dropForeign('media_id');
    table.foreign('media_id')
      .references('id')
      .inTable('media')
      .onDelete('set null');          
  });
  const destinations = knex.schema.alterTable('destinations', (table) => {
    table.dropForeign('media_id');
    table.foreign('media_id')
      .references('id')
      .inTable('media')
      .onDelete('set null');            
  });
  const pages = knex.schema.alterTable('pages', (table) => {
    table.dropForeign('media_id');
    table.foreign('media_id')
      .references('id')
      .inTable('media')
      .onDelete('set null');
    table.dropForeign('banner_id');
    table.foreign('banner_id')
      .references('id')
      .inTable('media')
      .onDelete('set null');
    table.dropForeign('overview_image_id');
    table.foreign('overview_image_id')
      .references('id')
      .inTable('media')
      .onDelete('set null');              
  });
  const content_blocks = knex.schema.alterTable('content_blocks', (table) => {
    table.dropForeign('media_id');
    table.foreign('media_id')
      .references('id')
      .inTable('media')
      .onDelete('set null');
  });
  const offers = knex.schema.alterTable('offers', (table) => {
    table.dropForeign('media_id');
    table.foreign('media_id')
      .references('id')
      .inTable('media')
      .onDelete('set null');
  });
  return Promise.all([tours, tour_documentation, tour_itineraries, destinations, pages, content_blocks, offers]);
};

exports.down = function (knex) {
  return new Promise(resolve => {
    resolve();
  })
};