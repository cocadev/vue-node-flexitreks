exports.up = function (knex) {
  return knex.schema.hasTable('enquiries').then(exists => {
    if (!exists) {
      return knex.schema.createTable('enquiries', table => {
        table.increments('id').primary();
        table.timestamp('createdAt').defaultTo(knex.fn.now());

        table.string('name');
        table.string('email');
        table.string('telephone');
        table.text('message');
        table.specificType('destination_ids', 'integer[]');
        table.specificType('tour_ids', 'integer[]');
      });
    }
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('enquiries');
};
