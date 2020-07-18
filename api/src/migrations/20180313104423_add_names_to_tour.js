exports.up = function (knex) {
  return knex.schema.alterTable('tours', (t) => {
    t.string('name_short');
    t.string('name_operator');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('tours', (t) => {
    t.dropColumns('name_short', 'name_operator');
  });
};
