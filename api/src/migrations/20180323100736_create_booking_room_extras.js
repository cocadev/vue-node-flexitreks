exports.up = function (knex) {
  return knex.schema.hasTable('booking_room_extras').then(exists => {
    if (!exists) {
      return knex.schema.createTable('booking_room_extras', table => {
        table.increments('id').primary();

        table.integer('booking_room_id')
          .references('id')
          .inTable('booking_rooms')
          .notNull()
          .onDelete('cascade');

        table.integer('cost');
        table.integer('quantity');
        table.boolean('post');

      });
    }
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('booking_room_extras');
};
