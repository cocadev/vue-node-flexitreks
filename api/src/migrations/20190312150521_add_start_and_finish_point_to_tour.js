exports.up = function(knex) {
  return knex.schema.alterTable('tours', (t) => {
    t.string('start_point');
    t.string('finish_point');
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('tours', (t) => {
    t.dropColumns('start_point');
    t.dropColumns('finish_point');
  });
};
