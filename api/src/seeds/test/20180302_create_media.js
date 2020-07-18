exports.seed = function (knex) {
  return knex('media').del()
    .then(function () {
      return knex('media').insert([
        {
          id: 1,
          url: 'images/2018/7/2/test.jpg'
        }
      ]);
    });
};
