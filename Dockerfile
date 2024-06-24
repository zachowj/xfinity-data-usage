FROM node:22-bookworm AS build

WORKDIR /home/node/app
RUN chown node:node /home/node/app
USER node

COPY package.json tsconfig.json ./

RUN yarn install --network-timeout 300000

COPY src ./src

RUN yarn build

FROM node:22-bookworm-slim

RUN apt-get update \
    && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends \
        dumb-init \
        libx11-xcb1 \
        libxrandr2 \
        libxcomposite1 \
        libxcursor1 \
        libxdamage1 \
        libxfixes3 \
        libxi6 \
        libgtk-3-0 \
        libatk1.0-0 \
        libasound2 \
        libdbus-1-3 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

WORKDIR /home/node/app
RUN chown node:node /home/node/app

USER node
EXPOSE 7878

COPY package.json ./
RUN yarn install --production --network-timeout 300000
RUN yarn playwright install firefox
RUN yarn cache clean
COPY --from=build /home/node/app/dist ./dist

ENTRYPOINT ["dumb-init", "--"]

CMD [ "node", "dist/app.js" ]

VOLUME /config
