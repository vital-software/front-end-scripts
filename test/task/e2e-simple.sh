#!/bin/bash

# Start in task/ even if run from root directory
cd "$(dirname "$0")"

# CLI, app, and test module temporary locations
# http://unix.stackexchange.com/a/84980
temp_cli_path=`mktemp -d 2>/dev/null || mktemp -d -t 'temp_cli_path'`
temp_app_path=`mktemp -d 2>/dev/null || mktemp -d -t 'temp_app_path'`
temp_module_path=`mktemp -d 2>/dev/null || mktemp -d -t 'temp_module_path'`

function cleanup {
  echo 'Cleaning up.'
  cd "$root_path"
  # Uncomment when snapshot testing is enabled by default:
  # rm ./packages/react-scripts/template/src/__snapshots__/App.test.js.snap
  rm -rf "$temp_cli_path" $temp_app_path
}

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

# Install packages
yarn cache clean
yarn install

# Create vitalizer server log file
tmp_server_log='vitalizer-start-temp.log'
rm -f $tmp_server_log

# Test local development mode
(../bin/vitalizer.js start 2>&1 > $tmp_server_log) &
pid=$!
sleep 30
cat $tmp_server_log
grep -q 'Compiled successfully!' $tmp_server_log
kill $pid

# Clean up server log
rm -f $tmp_server_log

# Test local build mode
NODE_ENV=production ../bin/vitalizer.js build

# Check for expected output
exists public/index.html
exists public/*.js
exists public/*.js.map
exists public/*.css
exists public/*.css.map

# Diff output files
diff public/index.html stub/index.html
diff -b -y --suppress-common-lines public/index.js stub/index.js
diff -b -y --suppress-common-lines public/index.css stub/index.css
