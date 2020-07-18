exports.seed = function (knex) {
  return knex('regions').del()
    .then(function () {
      return knex('regions').insert([
        { id: 1, name: 'The Danube', slug: 'the-danube' },
        { id: 2, name: 'Lake Constance', slug: 'lake-constance' }
      ]);
    });
};
