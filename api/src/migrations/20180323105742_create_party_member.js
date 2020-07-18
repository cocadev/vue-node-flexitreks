exports.up = function (knex) {
  return knex.schema.hasTable('party_members').then(exists => {
    if (!exists) {
      return knex.schema.createTable('party_members', table => {
        table.increments('id').primary();
        table.timestamp('createdAt').defaultTo(knex.fn.now());

        table.string('title');
        table.string('first_name');
        table.string('last_name');
        table.date('date_of_birth');
        table.integer('height');
        table.text('dietary_requirements');        

        table.integer('booking_id')
          .references('id')
          .inTable('bookings')
          .notNull()
          .onDelete('cascade');

        table.integer('booking_room_id')
          .references('id')
          .inTable('booking_rooms')
          .notNull()
          .onDelete('cascade');
        
        table.integer('tour_bike_id')
          .references('id')
          .inTable('tour_bikes')
          .onDelete('cascade');

      });
    }
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('party_members');
};
