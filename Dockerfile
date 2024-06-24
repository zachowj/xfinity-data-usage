FROM node:22-bookwork AS build

WORKDIR /home/node/app
RUN chown node:node /home/node/app
USER node

COPY package.json tsconfig.json ./

RUN yarn install --network-timeout 300000

COPY src ./src

RUN yarn build

FROM node:22-bookwork-slim

WORKDIR /home/node/app
RUN chown node:node /home/node/app

USER node
EXPOSE 7878

COPY package.json ./
RUN yarn install --production --network-timeout 300000
RUN npx playwright  install --with-deps firefox
RUN yarn cache clean
COPY --from=build /home/node/app/dist ./dist

ENTRYPOINT ["dumb-init", "--"]

CMD [ "node", "dist/app.js" ]
VOLUME /config
