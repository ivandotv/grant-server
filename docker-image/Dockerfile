FROM node:14.18.0-alpine

RUN apk --no-cache add curl dumb-init

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 CMD curl --fail http://localhost:${GRANT_HC}/healthcheck || exit 1

WORKDIR /opt/grant-server

ENV NODE_ENV=production

RUN chown node:node /opt/grant-server

USER node

COPY --chown=node:node package*.json ./

COPY --chown=node:node dist/cjs ./dist

RUN npm ci

ENTRYPOINT ["dumb-init", "node", "dist/index.js" ]
