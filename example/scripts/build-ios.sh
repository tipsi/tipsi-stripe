#!/bin/bash

set -e

# Go to ios path
cd ios

# Run release build
xcodebuild build \
  -workspace example.xcworkspace \
  -scheme example \
  -configuration Release \
  -sdk iphonesimulator \
  -destination 'platform=iOS Simulator,name=iPhone 6' \
  -derivedDataPath build \
  ONLY_ACTIVE_ARCH=NO \
  OTHER_LDFLAGS='$(inherited) -ObjC -lc++'
