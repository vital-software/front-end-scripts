FROM node:8.9

# Install common dependencies
RUN DEBIAN_FRONTEND=noninteractive apt-get update && \
    apt-get dist-upgrade -y && \
    apt-get install -y \
        ca-certificates \
        git \
        openssl \
        tzdata && \
    rm -rf /var/lib/apt/lists/* && \
    apt-get clean

# Set timezone
ENV TZ=Pacific/Auckland

# Add npm-auth-env helper
RUN echo -e "#/bin/bash\necho \"//registry.npmjs.org/:_authToken=\\\${NPM_TOKEN}\" > /app/.npmrc" > /usr/local/bin/npm-auth-env && \
    chmod +x /usr/local/bin/npm-auth-env

RUN mkdir -p /app
WORKDIR /app
ENV PATH=./node_modules/.bin:$PATH

ADD package.json yarn.lock /app/
RUN yarn install

ADD . /app
