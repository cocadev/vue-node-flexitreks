exports.seed = function (knex) {
  return knex('bikes').del()
    .then(function () {
      return knex('bikes').insert([
        {
          name: 'Electric bike with pannier & lock'
        }
      ]);
    });
};
