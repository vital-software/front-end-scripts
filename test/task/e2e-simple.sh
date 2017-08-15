#!/bin/bash

# Start in task/ even if run from root directory
cd "$(dirname "$0")"

# CLI, app, and test module temporary locations
# http://unix.stackexchange.com/a/84980
temp_cli_path=`mktemp -d 2>/dev/null || mktemp -d -t 'temp_cli_path'`
temp_app_path=`mktemp -d 2>/dev/null || mktemp -d -t 'temp_app_path'`
temp_module_path=`mktemp -d 2>/dev/null || mktemp -d -t 'temp_module_path'`

# Error messages are redirected to stderr
function handle_error {
  echo "$(basename $0): ERROR! An error was encountered executing line $1." 1>&2;
  cleanup
  echo 'Exiting with error.' 1>&2;
  exit 1
}

function handle_exit {
  cleanup
  echo 'Exiting without error.' 1>&2;
  exit
}

# function create_react_app {
#   node "$temp_cli_path"/node_modules/create-react-app/index.js "$@"
# }

# Check for the existence of one or more files.
function exists {
  for f in $*; do
    test -e "$f"
  done
}


# Exit the script with a helpful error message when any error is encountered
trap 'set +x; handle_error $LINENO $BASH_COMMAND' ERR

# Cleanup before exit on any termination signal
trap 'set +x; handle_exit' SIGQUIT SIGTERM SIGINT SIGKILL SIGHUP

# Echo every command being executed
set -x

# Go to root
cd ..
root_path=$PWD

# Clear cache to avoid issues with incorrect packages being used
if hash yarnpkg 2>/dev/null
then
  yarnpkg cache clean
fi

if hash npm 2>/dev/null
then
  # npm 5 is too buggy right now
  if [ $(npm -v | head -c 1) -eq 5 ]; then
    npm i -g npm@^4.x
  fi;
  npm cache clean || npm cache verify
fi

# Install Yarn so that the test can use it to install packages.
npm install -g yarn
yarn cache clean
yarn install
