exports.up = function (knex) {
  return knex.schema.hasTable('tour_room_extras').then(exists => {
    if (!exists) {
      return knex.schema.createTable('tour_room_extras', table => {
        table.increments('id').primary();
        table.timestamp('createdAt').defaultTo(knex.fn.now());

        table.integer('tour_id')
          .references('id')
          .inTable('tours')
          .notNull()
          .onDelete('cascade');

        table.string('name');
        table.boolean('pre').defaultTo(false);
        table.boolean('post').defaultTo(false);

        table.index('tour_id');
      });
    }
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('tour_room_extras');
};
