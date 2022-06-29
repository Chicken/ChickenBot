FROM node:16-bullseye-slim AS builder

WORKDIR /app

RUN apt update && \
    apt upgrade -y && \
    apt install -y \
    build-essential \
    python3 \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev

COPY yarn.lock package.json ./

RUN sed -i 's/"prepare": "husky install"/"prepare": ""/' ./package.json

RUN yarn --production=true --frozen-lockfile --link-duplicates

FROM node:16-bullseye-slim

WORKDIR /app

ENV NODE_ENV="production"

RUN apt update && \
    apt upgrade -y && \
    apt install -y dumb-init

RUN mkdir /app/data && \
    chown -R node:node /app

COPY --chown=node:node --from=builder /app .
COPY --chown=node:node src/ src/

USER node:node

ENTRYPOINT [ "/usr/bin/dumb-init", "--" ]
CMD [ "yarn", "start" ]