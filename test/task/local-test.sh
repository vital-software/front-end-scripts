docker run \
  --env CI=true \
  --env NPM_CONFIG_QUIET=true \
  --tty \
  --volume ${PWD}/vitalizer/..:/var/vitalizer \
  --workdir /var/vitalizer \
  --interactive \
  node:8.9.1 \
  bash -c "./test/task/e2e-simple.sh"
