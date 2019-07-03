Expenses tracker
==============

This is just a simple API to support different operations for expenses
tracker operations. The idea is that developers can create instances
of this API and use it for calculus, registration, stats and
projections.

Setup (docker)
-------

1. Create the `.env` file out of the `env.template` file.

`cp .env.template ./.env`

2. Fill all values on `.env` file.

**Note:** `DB_SERVER` and `DB_SERVER_TEST` are set to
`mongo` by default (to match `docker-compose` service 
name), if you happen not to use `docker-compose` setup,
make sure to change this to match the correct db server ip
or domain.

3. Build the docker containers

`docker-compose up --build`

4. Run the db configuration script (Only run this once, no needed for future builds)

`bash docker-config/bin/mongo/addUsers.sh`

Run the project (docker)
-------

Simply run

`docker-compose up --build`

