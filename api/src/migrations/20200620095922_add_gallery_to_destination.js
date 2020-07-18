exports.up = function (knex) {
    return knex.schema.alterTable('destinations', (t) => {
      t.integer('gallery_id')
        .references('id')
        .inTable('galleries')
        .onDelete('cascade');
      t.unique('gallery_id');

    });
  };
  
  exports.down = function (knex) {
    return knex.schema.alterTable('destinations', (t) => {
      t.dropColumn('gallery_id');
    });
  };
  