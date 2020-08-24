FROM node:14.8 AS build

WORKDIR /home/node/app
RUN chown node:node /home/node/app
USER node

COPY package.json tsconfig.json .docker/geckodriver.sh ./

RUN yarn install

COPY src ./src

RUN yarn build
RUN bash geckodriver.sh

FROM node:14.8-slim

RUN apt-get update \
    && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends firefox-esr \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

COPY --from=build /tmp/geckodriver /usr/local/bin/geckodriver

WORKDIR /home/node/app
RUN chown node:node /home/node/app

USER node
EXPOSE 7878

COPY package.json ./
RUN yarn install --production && yarn cache clean
COPY --from=build /home/node/app/dist ./dist

CMD [ "node", "dist/server.js" ]
VOLUME /config
