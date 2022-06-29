FROM node:16-alpine AS builder

WORKDIR /app

RUN apk update && \
    apk upgrade && \
    apk add \
    make \
    g++ \
    python3

COPY yarn.lock package.json ./

RUN sed -i 's/"prepare": "husky install"/"prepare": ""/' ./package.json

RUN yarn --production=true --frozen-lockfile --link-duplicates

FROM node:16-alpine

WORKDIR /app

ENV NODE_ENV="production"

RUN apk update && \
    apk upgrade && \
    apk add --no-cache dumb-init

RUN mkdir /app/data && \
    chown -R node:node /app

COPY --chown=node:node --from=builder /app .
COPY --chown=node:node src/ src/

USER node:node

ENTRYPOINT [ "/usr/bin/dumb-init", "--" ]
CMD [ "yarn", "start" ]