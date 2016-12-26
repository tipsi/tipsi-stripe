#!/bin/bash

case "${TRAVIS_OS_NAME}" in
  linux)
    rm -f $HOME/.gradle/caches/modules-2/modules-2.lock
  ;;
esac
