
exports.up = function(knex) {
  return knex.schema.alterTable('pages', (table) => {
    table.text('ksp_content');
    table.string('ksp_button_title');
    table.string('ksp_button_url');
    table.string('ksp_bg_hex');
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('pages', (table) => {
    table.dropColumns('ksp_content', 'ksp_button_title', 'ksp_button_url', 'ksp_bg_hex');
  });
};
