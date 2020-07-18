exports.seed = function (knex) {
  return knex('galleries').del()
    .then(function () {
      return knex('galleries').insert([
        {
          media: [1]
        }
      ]);
    });
};
