exports.up = function (knex) {
  return knex.schema.alterTable('destinations', (t) => {
    t.text('description').alter();
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('destinations', (t) => {
    t.string('description').alter();
  });
};
