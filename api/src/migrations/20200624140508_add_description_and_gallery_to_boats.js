exports.up = function (knex) {
    return knex.schema.alterTable('boats', (t) => {
        t.string('description');
        t.integer('gallery_id')
            .references('id')
            .inTable('galleries');
    });
};

exports.down = function (knex) {
    return knex.schema.alterTable('boats', (t) => {
        t.dropColumn('description');
        t.dropColumn('gallery_id');
    });
};