#!/bin/bash

if [[ "$(uname)" == "Darwin" ]]; then
  echo "Preparing to link tipsi-stripe for iOS"

  echo "Checking CocoaPods..."
  has_cocoapods=`which pod >/dev/null 2>&1`
  if [ -z "$has_cocoapods" ]
  then
    echo "CocoaPods already installed"
  else
    echo "Installing CocoaPods..."
    gem install cocoapods
  fi
fi
