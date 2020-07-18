exports.up = function (knex) {
  return knex.schema.alterTable('offers', (t) => {
    t.string('slug');
    t.string('title');
    t.string('subtitle');
    t.text('content');
    t.integer('media_id')
      .references('id')
      .inTable('media')
      .onDelete('cascade');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('offers', (t) => {
    t.dropColumns('slug', 'title', 'subtitle', 'content', 'media_id');
  });
};
