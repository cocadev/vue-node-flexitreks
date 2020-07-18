exports.up = function (knex) {
  return knex.schema.alterTable('operators', (t) => {
    t.text('contact');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('operators', (t) => {
    t.dropColumn('contact');
  });
};
