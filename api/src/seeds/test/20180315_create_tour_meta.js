exports.seed = function (knex) {
  return knex('tour_meta').del()
    .then(function () {
      return knex('tour_meta').insert([
        {
          tour_id: 1,
          key: 'weather',
          value: 'Some weather content'
        }
      ]);
    });
};
