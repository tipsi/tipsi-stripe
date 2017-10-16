#!/bin/bash

library_name=$(node -p "require('./package.json').name")

cd example_tmp
rm -rf node_modules && npm install

react-native unlink $library_name
react-native link

case "${TRAVIS_OS_NAME}" in
  osx)
    cd ./ios
    pod install
    cd ../
  ;;
esac

# Make sure that dependencies work correctly after reinstallation
rm -rf node_modules && npm install
