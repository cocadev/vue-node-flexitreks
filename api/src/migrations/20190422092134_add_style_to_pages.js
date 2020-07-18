exports.up = function(knex, Promise) {
  return knex.schema.alterTable('pages', (t) => {
    t.string('style');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('pages', (t) => {
    t.dropColumns('style');
  });
};
