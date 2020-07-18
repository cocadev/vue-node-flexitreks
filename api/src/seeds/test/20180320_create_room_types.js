exports.seed = function (knex) {
  return knex('room_types').del()
    .then(function () {
      return knex('room_types').insert([
        {
          name: 'Double',
          sleeps: 2
        }
      ]);
    });
};
