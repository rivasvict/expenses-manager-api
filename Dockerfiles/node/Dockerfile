# Using slim version over alpine due to an issue
# on apline with bcrypt failing silently
# https://github.com/kelektiv/node.bcrypt.js/issues/830
FROM node:14.15.0-slim
# TODO: Fix the use of environmental variables in this file
# HINT, ARGS could work for it
RUN echo "Running in environment: ${NODE_ENV}"
WORKDIR /home/node/app
COPY . /home/node/app
COPY package.json .
RUN npm install