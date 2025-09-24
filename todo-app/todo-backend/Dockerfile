FROM node:20

WORKDIR /usr/src/app/backend

COPY --chown=node:node . .

RUN npm ci

USER node

CMD npm start