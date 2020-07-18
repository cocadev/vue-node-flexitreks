exports.seed = function (knex) {
  return knex('customers').del()
    .then(function () {
      return knex('customers').insert([
        {
          id: 1,
          title: 'Mr',
          first_name: 'Trys',
          last_name: 'Mudford',
          email_address: 'trysmudford@gmail.com',
          telephone_number: '01273 814019',
          country: 'GB',
          address_line_1: '3 Meadow Business Centre',
          address_line_2: 'Old Uckfield Road',
          town: 'Ringmer',
          county: 'East Sussex',
          postcode: 'BN8 5RW'
        }
      ]);
    });
};
