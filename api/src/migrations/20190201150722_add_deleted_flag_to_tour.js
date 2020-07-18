exports.up = function(knex) {
  return knex.schema.alterTable('tours', (t) => {
    t.boolean('deleted').defaultTo(false);
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('tours', (t) => {
    t.dropColumns('deleted');
  });
};
