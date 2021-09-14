FROM node:16-buster AS build

WORKDIR /home/node/app
RUN chown node:node /home/node/app
USER node

COPY package.json tsconfig.json ./

RUN yarn install

COPY src ./src
COPY types ./types

RUN yarn build

FROM node:16-buster-slim

RUN apt-get update \
    && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends chromium dumb-init \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

WORKDIR /home/node/app
RUN chown node:node /home/node/app

USER node
EXPOSE 7878

COPY package.json ./
RUN yarn install --production && yarn cache clean
COPY --from=build /home/node/app/dist ./dist

ENTRYPOINT ["dumb-init", "--"]

CMD [ "node", "dist/app.js" ]
VOLUME /config
