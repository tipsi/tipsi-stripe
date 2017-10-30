#!/bin/bash

library_name=$(node -p "require('./package.json').name")

cd example_tmp
rm -rf node_modules && npm install

npm run add-podfile

cd ios
pod install
cd ..

node_modules/.bin/appium --session-override > appium.out &

# Configure Stripe variables
npm run configure

# Build iOS app
set -o pipefail && npm run build:ios | xcpretty -c -f `xcpretty-travis-formatter`

# Run iOS e2e tests
npm run test:ios
