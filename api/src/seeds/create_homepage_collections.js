
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('homepage_collections').del()
    .then(function () {
      // Inserts seed entries
      return knex('homepage_collections').insert([
        {id: 1, key: 'title', value: ''},
        {id: 2, key: 'content', value: ''},
        {id: 3, key: 'items', value: '[]'},
      ]);
    });
};
