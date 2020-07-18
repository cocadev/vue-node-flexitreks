exports.up = function (knex) {
  return knex.schema.alterTable('tours', (table) => {
    table.specificType('difficulty', 'text[]');
    table.string('length');
    table.string('months');
    table.text('highlights');
    table.integer('guidance');
    table.boolean('bike_and_boat').defaultTo(false);
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('tours', (table) => {
    table.dropColumns('difficulty', 'length', 'months', 'guidance', 'highlights', 'bike_and_boat');
  });
};
