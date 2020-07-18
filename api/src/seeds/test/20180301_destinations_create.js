exports.seed = function(knex) {
  return knex('destinations').del()
    .then(function () {
      return knex('destinations').insert([
        {id: 1, name: 'Italy', currency: 'Euro', slug: 'italy'},
        {id: 2, name: 'France', currency: 'Euro', slug: 'france'},
        {id: 3, name: 'Germany', currency: 'Euro', slug: 'germany'}
      ]);
    });
};
