exports.up = function (knex) {
  return knex.schema.alterTable('media', (t) => {
    t.string('alt');
    t.string('credit');
    t.string('caption');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('media', (t) => {
    t.dropColumns('alt', 'caption', 'credit');
  });
};
