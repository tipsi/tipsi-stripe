#!/bin/bash

library_name=$(node -p "require('./package.json').name")
library_version=$(node -p "require('./package.json').version")

cd example_tmp

tarball_name="$library_name-$library_version.tgz" npm run replace-tarball

case "${TRAVIS_OS_NAME}" in
  osx)
    npm run set-stripe-url-type
  ;;
esac

rm -rf node_modules && npm install

react-native unlink $library_name
react-native link

case "${TRAVIS_OS_NAME}" in
  osx)
    cd ios
    pod install
    cd ..
  ;;
esac

# Make sure that dependencies work correctly after reinstallation
rm -rf node_modules && npm install
