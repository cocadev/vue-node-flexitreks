exports.up = function (knex) {
  return knex.schema.alterTable('reviews', (t) => {
    t.text('service_comment').alter();
    t.text('product_comment').alter();
    t.text('response').alter();
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('reviews', (t) => {
    t.string('service_comment').alter();
    t.string('product_comment').alter();
    t.string('response').alter();
  });
};
