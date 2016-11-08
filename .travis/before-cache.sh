#!/bin/bash

case "${TRAVIS_OS_NAME}" in
  osx)
    rm -rf example/node_modules/tipsi-stripe
  ;;
  linux)
    rm -rf example/node_modules/tipsi-stripe
    rm -f $HOME/.gradle/caches/modules-2/modules-2.lock
  ;;
esac
