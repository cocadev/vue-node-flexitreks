exports.up = function (knex) {
  return knex.schema.hasTable('party_member_extras').then(exists => {
    if (!exists) {
      return knex.schema.createTable('party_member_extras', table => {
        table.increments('id').primary();

        table.integer('party_member_id')
          .references('id')
          .inTable('party_members')
          .notNull()
          .onDelete('cascade');

        table.integer('tour_party_extra_variation_id')
          .references('id')
          .inTable('tour_party_extra_variations')
          .notNull();

        table.integer('cost');

      });
    }
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('party_member_extras');
};
