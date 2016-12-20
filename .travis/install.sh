#!/bin/bash

library_name=$(node -p "require('./package.json').name")

case "${TRAVIS_OS_NAME}" in
  osx)
    cd example_tmp
    npm install
    react-native unlink $library_name
    react-native link
  ;;
  linux)
    cd example_tmp
    npm install
    react-native unlink $library_name
    react-native link
  ;;
esac
