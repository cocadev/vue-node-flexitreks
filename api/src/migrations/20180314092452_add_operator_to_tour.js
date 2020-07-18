exports.up = function (knex) {
  return knex.schema.alterTable('tours', (t) => {
    t.integer('operator_id')
      .references('id')
      .inTable('operators');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('tours', (t) => {
    t.dropColumn('operator_id');
  });
};
