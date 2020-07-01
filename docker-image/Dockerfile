FROM node:14.0.0-alpine


WORKDIR /opt/grant-server

RUN chown node:node /opt/grant-server

USER node

COPY --chown=node:node package*.json ./

COPY --chown=node:node dist/cjs ./dist

RUN npm ci --production

ENTRYPOINT [ "node", "dist/index.js" ]