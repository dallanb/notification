ARG NODE_VERSION
FROM node:${NODE_VERSION}

# Create app directory
WORKDIR /home/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package.json ./
COPY tslint.json ./
COPY tsconfig.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

COPY src ./src
COPY build/bin ./build/bin

EXPOSE 3000

## run entrypoint.sh
ENTRYPOINT ["sh", "./build/bin/entrypoint.sh"]