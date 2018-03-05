FROM node:8.9-alpine

# Install common Alpine dependencies
#   - bash because e2e-simple.sh needs it
RUN apk update && \
    apk upgrade && \
    apk add --no-cache \
      ca-certificates \
      git \
      openssl \
      bash \
      diffutils \
      tzdata && \
    wget -q -O /etc/apk/keys/sgerrand.rsa.pub https://raw.githubusercontent.com/sgerrand/alpine-pkg-glibc/master/sgerrand.rsa.pub && \
    wget https://github.com/sgerrand/alpine-pkg-glibc/releases/download/2.27-r0/glibc-2.27-r0.apk && \
    apk add --no-cache glibc-2.27-r0.apk && \
    rm glibc-2.27-r0.apk

# Set timezone
ENV TZ=Pacific/Auckland

# Add npm-auth-env helper
RUN echo -e "#/bin/bash\necho \"//registry.npmjs.org/:_authToken=\\\${NPM_TOKEN}\" > /vitalizer/.npmrc" > /usr/local/bin/npm-auth-env && \
    chmod +x /usr/local/bin/npm-auth-env

RUN mkdir -p /vitalizer
WORKDIR /vitalizer
ENV PATH=./node_modules/.bin:$PATH

ADD package.json yarn.lock /vitalizer/
RUN yarn install

ADD . /vitalizer
