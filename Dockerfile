FROM quay.io/vital/node:lts

# Avoid a million NPM install messages
ENV npm_config_loglevel warn

# Set working directory
RUN mkdir -p /vitalizer
WORKDIR /vitalizer

# Prepare for node_modules install
COPY package.json yarn.lock /vitalizer/

# Install node_modules
ARG NPM_TOKEN
RUN echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" > .npmrc && \
  yarn install && \
  rm .npmrc
ENV PATH=./node_modules/.bin:$PATH

# Add project files
ADD . /vitalizer
