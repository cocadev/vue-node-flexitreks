exports.up = function (knex) {
  return knex.schema.alterTable('bookings', (t) => {
    t.integer('filter_boat');
    t.integer('filter_from');
    t.boolean('filter_guided');
    t.integer('filter_nights');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('bookings', (t) => {
    t.dropColumns('filter_boat', 'filter_from', 'filter_guided', 'filter_nights');
  });
};
