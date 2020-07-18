exports.up = function (knex) {
  return knex.schema.alterTable('bookings', (t) => {
    t.date('arrival');
    t.string('arrival_label');
    
    t.date('departure');
    t.string('departure_label');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('bookings', (t) => {
    t.dropColumns('arrival', 'arrival_label', 'departure', 'departure_label');
  });
};
