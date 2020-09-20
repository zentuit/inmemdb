## Stage 1 (production base)
# This gets our prod dependencies installed and out of the way
FROM node:14-stretch-slim as base

ENV NODE_ENV=production

WORKDIR /node

COPY package*.json ./

# we use npm ci here so only the package-lock.json file is used
RUN npm config list \
    && npm ci \
    && npm cache clean --force


## Stage 2 (development)
# we bind-mount source code so don't need to COPY
FROM base as dev

ENV NODE_ENV=development

ENV PATH=/node/node_modules/.bin:$PATH

WORKDIR /node

RUN npm install -g nodemon
RUN npm install --only=development

WORKDIR /node/app

ENTRYPOINT ["nodemon", "/node/app/src/index.js"]


## Stage 3 (copy in source)
# For non-dev we COPY source code into builder for use in next two stages
# It gets its own stage so we don't have to copy twice
FROM base as source

USER node

WORKDIR /node/app

COPY --chown=node:node . .


## Stage 4 (testing)
# use this in automated CI
# it has prod and dev npm dependencies
FROM source as test

USER root

ENV NODE_ENV=development
ENV PATH=/node/node_modules/.bin:$PATH

# this copies all dependencies (prod+dev)
COPY --from=dev /node/node_modules /node/node_modules

# run linters as part of build
# be sure they are installed with devDependencies
# RUN eslint . 

# run unit tests as part of build
# RUN npm test

# run integration testing with docker-compose later
CMD ["npm", "run", "int-test"] 


## Stage 5 (default, production)
# this will run by default if you don't include a target
# it has prod-only dependencies
FROM source as prod

USER node

ENV NODE_ENV=production

RUN npm audit

ENTRYPOINT ["node", "./src/index.js"]
