exports.up = function (knex) {
  return knex.schema.alterTable('destinations', (t) => {
    t.string('currency');
    t.text('tipping');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('destinations', (t) => {
    t.dropColumn('currency');
    t.dropColumn('tipping');
  });
};
