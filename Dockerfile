FROM mcr.microsoft.com/playwright:jammy AS build
RUN useradd --create-home --shell /bin/bash node

WORKDIR /home/node/app
RUN chown node:node /home/node/app
USER node

COPY package.json tsconfig.json ./

RUN yarn install --network-timeout 300000

COPY src ./src

RUN yarn build

FROM mcr.microsoft.com/playwright:jammy
RUN useradd --create-home --shell /bin/bash node

RUN apt-get update \
    && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends dumb-init \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

WORKDIR /home/node/app
RUN chown node:node /home/node/app

USER node
EXPOSE 7878

COPY package.json ./
RUN yarn install --production --network-timeout 300000
RUN yarn cache clean
COPY --from=build /home/node/app/dist ./dist

# USER root
# RUN npx playwright install --with-deps firefox
# USER node

ENTRYPOINT ["dumb-init", "--"]

CMD [ "node", "dist/app.js" ]

VOLUME /config
