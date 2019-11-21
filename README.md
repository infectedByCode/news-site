# NEWS SITE

A reddit-style news site for creating and sharing articles on various topics. Users are able to create, comment and delete articles, create and delete comments as well as upvote comments and articles written by other users. A working example of the this API can be seen [here](https://msd-news.herokuapp.com/api).

## Getting Started

---

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

To be able to get the project up and running, you will need the following.

- Node v8.10.0 (minimum)
- npm [Installation instructions here]('https://www.npmjs.com/get-npm')
- PostgreSQL (PSQL) 

### Installing

A step by step guide to getting the project running on your local machine.

#### Install PostgreSQL (PSQL)

**_Mac_**

- Install Postrgres App https://postgresapp.com/
- Open the app (little blue elephant) and select initialize/start
- type `psql` into your terminal.

You should then see something similar to:

```
psql
psql (9.6.5, server 9.6.6)
Type "help" for help.

username=#
```

If the above does not show/you get an error, run the following commands in your terminal:

```
brew update
brew doctor
brew install postgresql
```

**Ubuntu**

Run these command in your terminal:

```
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
```

Next run the following commands to create a database user for Postgres.

```
sudo -u postgres createuser --superuser $USER
sudo -u postgres createdb $USER
```

Then run this command to enter the terminal application for PostgreSQL: `psql`

Now type:

```
ALTER USER username WITH PASSWORD 'mysecretword123';
```

_BUT_ Instead of username type your Ubuntu username and instead of 'mysecretword123' choose your own password and be sure to wrap it in quotation marks. Use a simple password like ‘password’. DONT USE YOUR LOGIN PASSWORD !

You can then exit out of psql by typing `\q`

#### Cloning to local machine

1. Go to the root of the repository [here](https://github.com/infectedByCode/news-site).
2. Fork the repository to your GitHub account.
3. Once forked, you will be given a git link. Copy this link.
4. Open up a terminal on your local machine and type `git clone https://github.com/YOUR-USERNAME/YOUR-REPOSITORY` and press *Enter*. Your local clone will then be created. 

#### Installing packages

The following packages will be required to get the API working locally. 

##### Production Packages
- cors
- express
- knex
- pg

##### Test Packages
- chai
- chai-sorted
- mocha
- supertest

To install all, type `npm install` and press *Enter*. The packages will be installed from the package.json.

#### Setup databases

Before modifying or adding new routes, it would be a good idea to setup the databases to ensure that your PSQL queries will work as expected.

To do this run the following:

`npm run setup-dbs`

Now the databases are setup, you can seed the data.

`npm run seed`

Seeding will take place before every test, so this should be the only time that you need to seed manually.

**_ You should now be able to start adding to the project _**

## Running the tests

---

There are test environments for util functions, app routing or both. A test database is provided for for checking the project is running probably. If you setup the databases correctly, then you should be able to check the format of the tables using psql.

### Util tests

These tests were created to manipulate data for the seeding. It is recommended that you use util testing if you plan to add any more data manipulation. Tests are located in /spec/util.spec.js.

**_Test Example_**

```
it('returns a new array of objects', () => {
  const input = articleData;
  const actualOutput = formatDates(input);

  expect(actualOutput).to.not.equal(input);
});
```

To run the util test run `npm run test-util`

### App tests

Tests have been created for routes including any possible errors. Any additional routes should be tested in a similar way.

**_Test Example_**

```
 describe('/topics', () => {
  it('GET:200, returns an array of objects object', () => {
    return request(app)
      .get('/api/topics')
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics).to.be.an('array');
        expect(topics).to.have.lengthOf(3);
    });
  });
 });
```

To run the util test run `npm run test-app`

## License

---

This project is licensed under the MIT License.
