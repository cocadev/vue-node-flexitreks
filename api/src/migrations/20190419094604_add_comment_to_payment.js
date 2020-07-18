exports.up = function(knex, Promise) {
  return knex.schema.alterTable('payments', (t) => {
    t.text('comment');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('payments', (t) => {
    t.dropColumns('comment');
  });
};
