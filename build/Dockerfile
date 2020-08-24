ARG NODE_VERSION
FROM node:${NODE_VERSION}


# Create app directory
WORKDIR /home/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package.json ./
COPY yarn.lock ./
COPY tsconfig.json ./
COPY tslint.json ./
COPY

RUN yarn install


