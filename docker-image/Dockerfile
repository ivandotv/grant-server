FROM node:14.15.4-alpine

RUN apk --no-cache add curl

WORKDIR /opt/grant-server

RUN chown node:node /opt/grant-server

USER node

COPY --chown=node:node package*.json ./

COPY --chown=node:node dist/cjs ./dist

ENV NODE_ENV=production

RUN npm ci

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 CMD curl --fail http://localhost:${GRANT_HC}/healthcheck || exit 1

ENTRYPOINT [ "node", "dist/index.js" ]
