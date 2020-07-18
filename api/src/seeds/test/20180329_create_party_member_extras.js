exports.seed = function (knex) {
  return knex('party_member_extras').del()
    .then(function () {
      return knex('party_member_extras').insert([
        {
          party_member_id: 1,
          tour_party_extra_variation_id: 1,
          cost: 12
        }
      ]);
    });
};
