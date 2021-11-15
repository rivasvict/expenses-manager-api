Expenses tracker
==============

This is just a simple API to support different operations for expenses
tracking. The idea is that developers can create instances
of this API and use it for calculus, registration, stats and
projections.

Setup (docker)
-------

1. Create the `.env` file out of the `env.template` file.

`cp .env.template ./.env`

2. Fill all values on `.env` file.

**Note:** The following variables on the `.env` files have a
default value (to match `docker-compose` service 
name):

```
DB_SERVER=mongo
DB_TEST_SERVER=mongo
REDIS_SERVER=redis
```

If you happen not to use `docker-compose` setup,
make sure to change this to match the correct db server ip
or domain

3. Build the docker containers

`docker-compose up --build`

4. While the previous command is running, in another terminal,
please run the db configuration script (Only run this once, no
needed for future builds)

`bash docker-config/bin/mongo/addUsers.sh`

5. Stop the `docker-compose` running instance and start them again
with docker-compose up

Run the project (docker)
-------

Simply run

`docker-compose up`

# TODO

- [ ] Create a script to always check if the db is fully configured and if not, run  `bash docker-config/bin/mongo/addUsers.sh` (To set up the db user), if so, IGNORE it
- [ ] Add to this README.md file how to run the project from the bash scripts that will start and stop docker-compose

