ARG NODE_VERSION
FROM node:${NODE_VERSION}

# Create app directory
WORKDIR /home/app

# Install dependencies
RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y postgresql-client netcat-openbsd gcc && \
    apt-get clean

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package.json ./package.json
COPY tsconfig.json ./tsconfig.json
COPY tslint.json ./tslint.json
COPY environment.d.ts ./environment.d.ts
COPY .mocharc.json ./.mocharc.json
COPY database.json ./database.json

RUN npm install
RUN npm install -g db-migrate

COPY src ./src
COPY build/bin/entrypoint.sh ./build/bin/entrypoint.sh

COPY bin/init-pg.sh ./bin/init-pg.sh


COPY bin/reset-pg.sh ./bin/reset-pg.sh
COPY bin/reset-mongo.sh ./bin/reset-mongo.sh

## run entrypoint.sh
ENTRYPOINT ["sh", "./build/bin/entrypoint.sh"]

