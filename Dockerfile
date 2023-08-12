FROM node:lts-buster-slim AS builder

RUN apt-get -y update \
    && apt-get install -y git \
    && apt-get autoremove -y \
    && apt-get autoclean -y \
    && apt-get clean -y \
    && rm -rf /var/lib/apt/lists/*

COPY web/. /srv/ekko.dev

WORKDIR /srv/ekko.dev

RUN yarn install

RUN yarn build

FROM nginx:alpine
COPY --from=builder /srv/ekko.dev/dist/. /usr/share/nginx/html/.
