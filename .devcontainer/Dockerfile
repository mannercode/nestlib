FROM node:24-slim
ENV LANG=C.UTF-8

ARG DEV_TOOLS="git curl jq tree vim net-tools screen iproute2 ca-certificates"
RUN apt-get update; \
    apt-get install -y --no-install-recommends \
    $DEV_TOOLS; \
    rm -rf /var/lib/apt/lists/*; \
    npm i -g npm-check-updates husky @commitlint/cli; \
    npm cache clean --force
