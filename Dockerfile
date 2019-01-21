FROM node:11

ENV APP_DIR=/opt/bamboo
WORKDIR ${APP_DIR}

RUN mkdir -p ${APP_DIR}

EXPOSE 8030
EXPOSE 5000

RUN yarn global add serve concurrently

COPY map/package.json map/yarn.lock map/*.json ./map/
COPY map/src ./map/src
COPY map/public ./map/public
RUN cd map && yarn install && yarn build && rm -rf node_modules src public build/static/js/*.map

COPY server/package.json server/yarn.lock server/*.json ./server/
COPY server/src ./server/src
RUN cd server && yarn install && yarn build

CMD ["yarn", "--cwd", "server", "server" ]
