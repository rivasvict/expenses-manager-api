Expenses tracker
==============

This is just a simple API to support different operations for expenses
tracking. The idea is that developers can create instances
of this API and use it for calculus, registration, stats and
projections.

## Development setup (docker)
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

For **development** environments

`docker-compose up --build`

or for **production** environments

`docker-compose --file docker-compose.yml --file docker-compose.prod.yml up --build`

4. While the previous command is running, in another terminal,
please run the db configuration script (Only run this once, no
needed for future builds)

`bash docker-config/bin/mongo/addUsers.sh`

5. Stop the `docker-compose` running instance and start them again
with docker-compose up

Run the project (docker)
-------

Simply in **development** environemnt, run

`docker-compose up`

### Run untit tests on docker

Provide permissions to the script

```
chmod +x bin/scripts/run-unit-tests-with-docker.sh
```

Enjoy

```
bin/scripts/run-unit-tests-with-docker.sh
```

## Production setup with domain and SSL with certbot and letsencrypt
-------

All of the previous setup steps are required for the setup of the production environment.

**Note:** The reference for the nginx-certbot docker production configuration file comes from this [guide](https://pentacent.medium.com/nginx-and-lets-encrypt-with-docker-in-less-than-5-minutes-b4b8a60d3a71) and also from this [repo](https://github.com/wmnnd/nginx-certbot) (Which is made from the previously mentioned guide)

Copy the necessary template
-------

Copy the files for the Docker production configuration and the LetsEncrypt initialization script

`cp docker-compose.prod.yml.template ./docker-compose.prod.yml; cp init-letsencrypt.sh.template ./init-letsencrypt.sh;`

**Note:** There are some comments in the `docker-compose.prod.yml`, we will be referring to the steps in that file as to which are the ones we have to uncomment at a given time in the setup.

In the `init-letsencrypt.sh` file, make sure to:

1. Replace the example.com and www.example.com by your domain names in the `domains` variable.
2. Add your `email` to the email variable.
3. If you are testing, set the `staging` variable to `1` to avoid [request limits](https://letsencrypt.org/docs/rate-limits/) to letsencrypt.

Add an nginx configuration file
-------

Create the folder structure for the nginx configuration file.

On the root of the project: `mkdir nginx; mkdir nginx/conf.d`

Add your nginx configuration file for the production environment and call it `default.conf`.

Here is a [suggestion](https://github.com/wmnnd/nginx-certbot/blob/master/data/nginx/app.conf) of the nginx configuration file.

**Note:** Remember to change all appearances of the `example.org` string in the file to your domain name.

**Disclaimer:** This is a **suggested** configuration file, please be aware that the file should addapt to **your** needs and security practices.

docker-compose.prod.yml steps 1 and 2
-------

Please follow the instruction of the steps 1 and 2 of the `docker-compose.prod.yml`

Run the project for the first time
-------

`docker-compose --file docker-compose.yml --file docker-compose.prod.yml up --build`

Note that the project is broken, now stop it and run:

`docker-compose down`

Run the init-letsencrypty.sh
-------

Provide the `init-letsencrypt.sh` file with execution permissions

`chmod +x init-letsencrypt.sh`

Run it

`./init-letsencrypt.sh`

Once it runs successfully for the first time, change the variable `staging` of the `init-letsencrypt.sh` file from `1` to `0` to emit the real certificate and run the scripty again;

`./init-letsencrypt.sh`

if this one ran successfully, you have generated the SSL certificates and you are ready to go.

Configure the certificate auto-renewal
-------

Make sure to execute the steps 3 and 4 of the `docker-compose.prod.yml` file.

Run the production environment
-------

`docker-compose --file docker-compose.yml --file docker-compose.prod.yml up --build`

# TODO

- [ ] Create a script to always check if the db is fully configured and if not, run  `bash docker-config/bin/mongo/addUsers.sh` (To set up the db user), if so, IGNORE it
- [ ] Add to this README.md file how to run the project from the bash scripts that will start and stop docker-compose

