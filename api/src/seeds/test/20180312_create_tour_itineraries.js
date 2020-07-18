exports.seed = function (knex) {
  return knex('tour_itineraries').del()
    .then(function () {
      return knex('tour_itineraries').insert([
        {
          title: 'Day 1 - Paris to Calais',
          content: 'Test public content',
          type: 'public',
          tour_id: 1,
          media_id: 1
        },
        {
          title: 'Day 1 - Paris to Calais',
          content: 'Test documentation content',
          type: 'documentation',
          tour_id: 1,
          media_id: 1
        }
      ]);
    });
};
