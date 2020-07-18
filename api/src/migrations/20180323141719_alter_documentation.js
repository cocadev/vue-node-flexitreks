exports.up = function (knex) {
  return knex.schema.alterTable('tour_documentation', (table) => {
    table.dropColumn('luggage_pickup');
    table.dropColumn('luggage_delivery');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('tour_documentation', (table) => {
    table.string('luggage_pickup');
    table.string('luggage_delivery');
  });
};
