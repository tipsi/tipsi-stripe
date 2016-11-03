#!/bin/bash

case "${TRAVIS_OS_NAME}" in
  osx)
    $HOME/.nvm/nvm.sh
    nvm install 6
    gem install cocoapods --pre # Since Travis is not always on latest version
    travis_wait pod repo update --silent
  ;;
  linux)
    $HOME/.nvm/nvm.sh
    nvm install stable
  ;;
esac
