#!/bin/bash

set -e

if [[ $@ == *"--skip-new"* ]]; then
  skip_new=true
else
  skip_new=false
fi

if [[ $@ == *"--use-old"* ]]; then
  use_old=true
else
  use_old=false
fi

proj_dir_old=example
proj_dir_new=example_tmp
proj_dir_podspec=example_podspec

react_native_version=$(cat $proj_dir_old/package.json | sed -n 's/"react-native": "\(\^|~\)*\(.*\)",*/\2/p')
library_name=$(node -p "require('./package.json').name")
library_version=$(node -p "require('./package.json').version")

files_to_copy=(
  .appiumhelperrc
  package.json
  package-lock.json
  app.json
  index.{ios,android}.js
  android/appium-config.json
  android/build.gradle
  android/app/build.gradle
  android/gradle/wrapper/gradle-wrapper.properties
  android/gradle.properties
  ios/example/AppDelegate.m
  src
  scripts
  __tests__
  rn-cli.config.js
  ios/Podfile
)

isMacOS() {
  [ "$(uname)" == "Darwin" ]
}

###################
# BEFORE INSTALL  #
###################

# Check Stripe environment variables
[ -z "$PUBLISHABLE_KEY" ] && echo "Need to set Stripe PUBLISHABLE_KEY" && exit 1;
[ -z "$BACKEND_URL" ] && echo "Warning!  You need BACKEND_URL defined to run payment intent use cases"
# Skip iOS step if current os is not macOS
! isMacOS && echo "Current os is not macOS, setup for iOS will be skipped"
# Install react-native-cli if not exist
if ! type react-native > /dev/null; then
  npm install -g react-native-cli
fi

# Remove existing tarball
rm -rf *.tgz

# Create new tarball
npm pack

if ($skip_new && ! $use_old); then
  echo "Creating new example project skipped"
  # Go to new test project
  cd $proj_dir_new
elif (! $skip_new && ! $use_old); then
  echo "Creating new example project"
  # Remove old test project and tmp dir if exist
  rm -rf $proj_dir_new $proj_dir_podspec tmp
  # Init new test project in tmp directory
  mkdir tmp
  cd tmp
  echo "Initializing react native"
  react-native init $proj_dir_old --version $react_native_version
  # Remove __tests__ folder to avoid conflicts
  rm -rf $proj_dir_old/__tests__
  # Move new project from tmp dir and remove tmp dir
  cd ..
  cp -R tmp/$proj_dir_old $proj_dir_podspec
  mv tmp/$proj_dir_old $proj_dir_new
  rm -rf tmp
  # Copy necessary files from example project
  for i in ${files_to_copy[@]}; do
    if [ -e $proj_dir_old/$i ]; then
      cp -Rp $proj_dir_old/$i $proj_dir_new/$i
      cp -Rp $proj_dir_old/$i $proj_dir_podspec/$i
    fi
  done
  # Go to new test project
  cd $proj_dir_new
else
  echo "Using example folder for tests"
  # Go to old test project
  cd $proj_dir_old
fi

isMacOS && npm run set-stripe-url-type

###################
# INSTALL         #
###################

# Install dependencies
rm -rf node_modules && npm ci
npm i tipsi-stripe@../tipsi-stripe-$library_version.tgz --save

echo "Unlinking $library_name"
react-native unlink $library_name --verbose

echo "Linking"
react-native link

if isMacOS; then
  echo "Install iOS dependencies"
  cd ios
  pod install
  cd ..
fi

# Make sure that dependencies work correctly after reinstallation
echo "Removing node modules and reinstall"
rm -rf node_modules && npm install

###################
# BEFORE BUILD    #
###################

# Run appium
(pkill -9 -f appium || true)
npm run appium > /dev/null 2>&1 &

###################
# BUILD           #
###################

# Configure Stripe variables
npm run configure

# Build Android app
npm run build:android

# Build iOS app
isMacOS && npm run build:ios | xcpretty

###################
# TESTS           #
###################

# Run Android e2e tests
TEST_SUITE=android_5 npm run test:android

# Run iOS e2e tests
isMacOS && npm run test:ios

if isMacOS; then
  cd ../$proj_dir_podspec

  npm run set-stripe-url-type

  # Install dependencies
  rm -rf node_modules && npm install

  npm run add-podfile

  cd ios
  pod install
  cd ..

  # Configure Stripe variables
  npm run configure

  # Build iOS app
  npm run build:ios | xcpretty

  # Run iOS e2e tests
  npm run test:ios
fi
