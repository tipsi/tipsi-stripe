#!/bin/bash

case "${TRAVIS_OS_NAME}" in
  osx)
    cd example
    npm run configure
    set -o pipefail && npm run build:ios | xcpretty -c -f `xcpretty-travis-formatter`
    npm run test:ios
  ;;
  linux)
    cd example
    npm run configure
    npm run build:android
    npm run test:android
  ;;
esac
