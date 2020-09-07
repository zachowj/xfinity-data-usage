FROM node:14.9 AS build

WORKDIR /home/node/app
RUN chown node:node /home/node/app
USER node

COPY package.json tsconfig.json ./

RUN yarn install

COPY src ./src

RUN yarn build

FROM node:14.9-alpine3.12

RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      freetype-dev \
      harfbuzz \
      ca-certificates \
      ttf-freefont \
    && rm -rf /var/cache/apk/* /tmp/*

WORKDIR /home/node/app
RUN chown node:node /home/node/app

USER node
EXPOSE 7878

COPY package.json ./
RUN yarn install --production && yarn cache clean
COPY --from=build /home/node/app/dist ./dist

CMD [ "node", "dist/app.js" ]
VOLUME /config
