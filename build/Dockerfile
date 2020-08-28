ARG NODE_VERSION
FROM node:${NODE_VERSION}


# Create app directory
WORKDIR /home/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package.json ./package.json
COPY yarn.lock ./yarn.lock
COPY tsconfig.json ./tsconfig.json
COPY tslint.json ./tslint.json
COPY node_modules ./node_modules
COPY environment.d.ts ./environment.d.ts

RUN yarn install

COPY src ./src
COPY build/bin ./build/bin

## run entrypoint.sh
ENTRYPOINT ["sh", "./build/bin/entrypoint.sh"]

