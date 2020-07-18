exports.seed = function (knex) {
  return knex('decks').del()
    .then(function () {
      return knex('decks').insert([
        {
          name: 'Lower deck'
        },
        {
          name: 'Upper deck'
        }
      ]);
    });
};
