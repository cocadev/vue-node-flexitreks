exports.up = function (knex) {
  return knex.schema.alterTable('media', (t) => {
    t.string('title');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('media', (t) => {
    t.dropColumn('title');
  });
};
