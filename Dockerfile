FROM node:18-bullseye AS build

WORKDIR /home/node/app
RUN chown node:node /home/node/app
USER node

COPY package.json tsconfig.json ./

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=1

RUN yarn install --network-timeout 300000

COPY src ./src

RUN yarn build

FROM node:18-bullseye-slim

RUN apt-get update \
    && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends chromium dumb-init \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

WORKDIR /home/node/app
RUN chown node:node /home/node/app

USER node
EXPOSE 7878

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=1
ENV CHROMIUM_BIN=/usr/bin/chromium

COPY package.json ./
RUN yarn install --production --network-timeout 300000 && yarn cache clean
COPY --from=build /home/node/app/dist ./dist

ENTRYPOINT ["dumb-init", "--"]

CMD [ "node", "dist/app.js" ]
VOLUME /config
