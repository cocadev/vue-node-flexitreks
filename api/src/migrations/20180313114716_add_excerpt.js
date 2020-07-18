exports.up = function (knex) {
  return knex.schema.alterTable('tours', (t) => {
    t.string('excerpt');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('tours', (t) => {
    t.dropColumns('excerpt');
  });
};
