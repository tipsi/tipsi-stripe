#!/bin/bash

cd example_tmp
npm run configure

case "${TRAVIS_OS_NAME}" in
  osx)
    set -o pipefail && npm run build:ios | xcpretty -c -f `xcpretty-travis-formatter`
    npm run test:ios
  ;;
  linux)
    npm run build:android
    npm run test:android
  ;;
esac
