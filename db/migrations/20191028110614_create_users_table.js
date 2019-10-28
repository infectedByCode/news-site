exports.up = function(knex) {
  return knex.schema.createTable('users', usersTable => {
    usersTable
      .string('username', 20)
      .unique()
      .primary()
      .notNullable();
    usersTable
      .string('avatar_url')
      .defaultTo('https://avatars.dicebear.com/v2/identicon/7607f3a0aaa538854dc7f18c6bc58263.svg');
    usersTable.string('name', 50).notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('users');
};
