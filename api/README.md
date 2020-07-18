# Flexitreks API

## Setup

1. Create `/.env` file with the following format:
```
JWT_SIG=Morbi!leorisus?portaaccons2ecteturac5vestibul*umateros.
DB_DEV_HOST=localhost
DB_DEV_USER=postgres
DB_DEV_PASSWORD=
DB_DEV_NAME=flexitreks_dev
DB_TEST_HOST=localhost
DB_TEST_USER=postgres
DB_TEST_PASSWORD=
DB_TEST_NAME=flexitreks_test
DB_PROD_HOST=aa13ciaawz3uten.cr1w155b7wri.eu-west-2.rds.amazonaws.com
DB_PROD_USER=flexitreks
DB_PROD_PASSWORD=sm3yn7s5PyU51Pa
DB_PROD_NAME=flexitreks
DB_PROD_PORT=5432
TZ=UTC
S3_Key=AKIAIGBXNOWFFYVP2OZQ
S3_ACCESS=G+dDuZ6lpWjZnTvoxM9URYrtdPKpIhEOUagm9M0R
S3_Bucket=flexitreks
S3_Region=eu-west-2
SAGEPAY_LIVE=false
SAGEPAY_NOTIFICATION=https://bb0a9f89.ngrok.io/api/v1/payments/respond
SITE=http://localhost:3000
EMAIL=trysmudford@gmail.com
MC_API=8c50322328db54cbb6f04284617bfa26-us7
MC_LIST=9eac8ddd3e
TEST_EMAIL=true

```
2. Install knex CLI globally: `npm install -g knex`
3. `npm i`
4. `npm run migrate:latest`
5. `npm run dev`


## Knex seeds and migrations
### Seeds
#### Create
```
npm run seed the_name_of_seed

# By default this runs on development, but can be overwritten:
npm run seed the_name_of_seed NODE_ENV=development

# Alternatively, for test seeds (the most common):
npm run seed:test the_name_of_seed
```

#### Run
```
# Environment rules apply as above:
npm run seed:run
```

### Migrations
#### Create
```
npm run migrate the_name_of_migration
```

#### Run
```
npm run migrate:latest
```

#### Rollback
```
npm run migrate:rollback
```

```
mocha src/tests --grep "POST /tours" --compilers js:babel-core/register --timeout 5000
```

#### Deploy

This requires installation of the Elastic Beanstalk CLI (https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3-install.html)

Activate virtualenv if using one;
```
source ~/eb-ve/bin/activate
```

Deploy via eb;
```
eb deploy FlexitreksApi-env
```

