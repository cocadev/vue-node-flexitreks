exports.up = function(knex) {
  return knex.schema.alterTable('tours', (t) => {
    t.string('arrival_days');
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('tours', (t) => {
    t.dropColumns('arrival_days');
  });
};