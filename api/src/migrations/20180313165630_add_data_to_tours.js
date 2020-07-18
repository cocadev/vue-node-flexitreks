exports.up = function (knex) {
  return knex.schema.alterTable('tours', (t) => {
    t.text('excerpt').alter();
    t.text('content');
    t.string('tour_code');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('tours', (t) => {
    t.string('excerpt').alter();
    t.dropColumn('content');
    t.dropColumn('tour_code');
  });
};
