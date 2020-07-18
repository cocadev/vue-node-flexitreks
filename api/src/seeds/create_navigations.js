
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('navigations').del()
    .then(function () {
      // Inserts seed entries
      return knex('navigations').insert([
        {id: 1, parent_category: 'destinations', column_1_title: 'Countries', column_2_title: 'Regions'},
        {id: 2, parent_category: 'categories',},
        {id: 3, parent_category: 'special offers',},
        {id: 4, parent_category: 'information',},
      ]);
    });
};
