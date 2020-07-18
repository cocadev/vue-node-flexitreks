exports.up = function (knex) {
  return knex.schema.alterTable('tour_bikes', (table) => {
    table.string('formula');
    table.float('gross', 4).default(0);
    table.float('non_com', 2).default(0);
    table.float('net', 4).default(0);
    table.float('adjustment', 2).default(0);

    table.integer('markup_rate_id')
      .references('id')
      .inTable('markup_rates');
  }).then(function () {
    return knex.schema.alterTable('tour_room_extra_variations', (table) => {
      table.string('formula');
      table.float('gross', 4).default(0);
      table.float('non_com', 2).default(0);
      table.float('net', 4).default(0);
      table.float('adjustment', 2).default(0);

      table.integer('markup_rate_id')
        .references('id')
        .inTable('markup_rates');
    });
  }).then(function () {
    return knex.schema.alterTable('tour_party_extra_variations', (table) => {
      table.string('formula');
      table.float('gross', 4).default(0);
      table.float('non_com', 2).default(0);
      table.float('net', 4).default(0);
      table.float('adjustment', 2).default(0);

      table.integer('markup_rate_id')
        .references('id')
        .inTable('markup_rates');
    });
  }).then(function () {
    return knex.schema.alterTable('tour_prices', (table) => {
      table.string('formula');
      table.float('gross', 4).default(0);
      table.float('non_com', 2).default(0);
      table.float('net', 4).default(0);
      table.float('adjustment', 2).default(0);

      table.integer('markup_rate_id')
        .references('id')
        .inTable('markup_rates');
    });
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('tour_bikes', (table) => {
    table.dropColumns('formula', 'gross', 'non_com', 'net', 'adjustment', 'markup_rate_id');
  }).then(function () {
    return knex.schema.alterTable('tour_room_extra_variations', (table) => {
      table.dropColumns('formula', 'gross', 'non_com', 'net', 'adjustment', 'markup_rate_id');
    });
  }).then(function () {
    return knex.schema.alterTable('tour_party_extra_variations', (table) => {
      table.dropColumns('formula', 'gross', 'non_com', 'net', 'adjustment', 'markup_rate_id');
    });
  }).then(function () {
    return knex.schema.alterTable('tour_prices', (table) => {
      table.dropColumns('formula', 'gross', 'non_com', 'net', 'adjustment', 'markup_rate_id');
    });
  });
};
