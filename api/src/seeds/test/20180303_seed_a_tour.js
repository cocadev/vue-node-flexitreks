exports.seed = function(knex) {
  return knex('tours').del()
    .then(function () {
      return knex('tours').insert([
        {
          name: '4 Countries Cycling Holiday',
          name_short: '4 Countries',
          name_operator: '4 Countries Cycling Holiday',
          tour_code: '1234',
          content: 'Some content',
          slug: '4-countries-cycling-holiday',
          operator_id: 1,
          status: 'live',
          media_id: 1,
          gallery_id: 1,
          nights: [7]
        }
      ]);
    });
};
