exports.seed = function (knex) {
  return knex('accommodation_categories').del()
    .then(function () {
      return knex('accommodation_categories').insert([
        {
          name: 'Comfort'
        }
      ]);
    });
};
