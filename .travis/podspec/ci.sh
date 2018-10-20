#!/bin/bash

library_name=$(node -p "require('./package.json').name")
library_version=$(node -p "require('./package.json').version")

cd example_tmp

npm run set-stripe-url-type

rm -rf node_modules && npm install

npm run add-podfile

cd ios
pod update
pod install
cd ..

node_modules/.bin/appium --session-override > appium.out &

# Configure Stripe variables
npm run configure

# Build iOS app
set -o pipefail && npm run build:ios | xcpretty -c -f `xcpretty-travis-formatter`

# Run iOS e2e tests
npm run test:ios
