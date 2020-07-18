exports.seed = function (knex) {
  return knex('boats').del()
    .then(function () {
      return knex('boats').insert([
        {
          name: 'MS Normandie'
        }
      ]);
    });
};
