exports.up = function(knex, Promise) {
  return knex.schema.alterTable('media', (t) => {
    t.integer('orders');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('media', (t) => {
    t.dropColumns('orders');
  });
};
