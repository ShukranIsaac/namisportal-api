# Use nodejs version 10
FROM node:10

# Create app directory in docker image
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN rm /bin/sh && ln -s /bin/bash /bin/sh && \
  npm install -g nodemon

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 3300
CMD [ "nodemon", "src" ]