const dotenv = require('dotenv');
dotenv.config({ path: `${__dirname}/../.env` });
const config = process.env;

module.exports = {
  development: {
    client: 'postgres',
    connection: {
      timezone: 'UTC',
      host: config.DB_DEV_HOST,
      user: config.DB_DEV_USER,
      password: config.DB_DEV_PASSWORD,
      database: config.DB_DEV_NAME,
      port: config.DB_DEV_PORT || 5432
    },
    migrations: {
      tableName: 'knex_migrations',
    }
  },

  test: {
    client: 'postgres',
    connection: {
      timezone: 'UTC',
      host: config.DB_TEST_HOST,
      user: config.DB_TEST_USER,
      password: config.DB_TEST_PASSWORD,
      database: config.DB_TEST_NAME
    },
    seeds: {
      directory: __dirname + '/seeds/test'
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: __dirname + '/migrations'
    }
  },

  live: {
    client: 'postgres',
    connection: {
      timezone: 'UTC',
      host: config.DB_PROD_HOST,
      user: config.DB_PROD_USER,
      password: config.DB_PROD_PASSWORD,
      database: config.DB_PROD_NAME,
      port: config.DB_PROD_PORT
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    }
  },
};
