
exports.up = function(knex, Promise) {
  return knex.schema.alterTable('tours', (t) => {
    t.boolean('solo_cyclists_allowed').defaultTo(true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('tours', (t) => {
    t.dropColumns('solo_cyclists_allowed');
  });
};
