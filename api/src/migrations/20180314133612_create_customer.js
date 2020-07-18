exports.up = function (knex) {
  return knex.schema.hasTable('customers').then(exists => {
    if (!exists) {
      return knex.schema.createTable('customers', table => {
        table.increments('id').primary();
        table.string('title');
        table.string('first_name');
        table.string('last_name');
        table.string('email_address');
        table.string('telephone_number');
        table.string('alternative_telephone_number');
        table.string('country');
        table.string('address_line_1');
        table.string('address_line_2');
        table.string('town');
        table.string('county');
        table.string('postcode');
        table.timestamp('createdAt').defaultTo(knex.fn.now());
      });
    }
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('customers');
};
