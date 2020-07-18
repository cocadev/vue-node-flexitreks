exports.seed = function (knex) {
  return knex('operators').del()
    .then(function () {
      return knex('operators').insert([
        {
          id: 1,
          name: 'IberoCycle',
          contact: '<p>Office: 0034 (0) 942 581 092</p><p>Mobile: 0034 619 645 021</p>'
        }
      ]);
    });
};
