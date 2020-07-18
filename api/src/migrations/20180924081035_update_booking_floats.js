exports.up = function (knex) {
  return knex.schema.alterTable('bookings', (t) => {
    t.float('total_cost', 2).alter();
    t.float('total_rooms', 2).alter();
    t.float('total_bikes', 2).alter();
    t.float('total_room_extras', 2).alter();
    t.float('total_party_extras', 2).alter();
    t.float('total_reductions', 2).alter();
    t.float('total_deposit', 2).alter();
    t.float('total_at_booking', 2).alter();
    t.float('total_charges', 2).alter();
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('bookings', (t) => {
    t.integer('total_cost').alter();
    t.integer('total_rooms').alter();
    t.integer('total_bikes').alter();
    t.integer('total_room_extras').alter();
    t.integer('total_party_extras').alter();
    t.integer('total_reductions').alter();
    t.integer('total_deposit').alter();
    t.integer('total_at_booking').alter();
    t.integer('total_charges').alter();
  });
};
