#!/bin/bash

init_new_example_project() {
  proj_dir_old=example
  proj_dir_new=example_tmp

  react_native_version=$(cat $proj_dir_old/package.json | sed -n 's/"react-native": "\(\^|~\)*\(.*\)",*/\2/p')

  files_to_copy=(
    .appiumhelperrc
    package.json
    index.{ios,android}.js
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

  mkdir tmp
  cd tmp
  react-native init $proj_dir_old --version $react_native_version
  rm -rf $proj_dir_old/__tests__
  cd ..
  mv tmp/$proj_dir_old $proj_dir_new
  rm -rf tmp

  for i in ${files_to_copy[@]}; do
    if [ -e $proj_dir_old/$i ]; then
      cp -Rp $proj_dir_old/$i $proj_dir_new/$i
    fi
  done
}

# NVM_NODEJS_ORG_MIRROR is deprecated and will be removed in node-gyp v4,
# please use NODEJS_ORG_MIRROR
export NODEJS_ORG_MIRROR=http://nodejs.org/dist

$HOME/.nvm/nvm.sh
nvm install 8.9.0
npm i npm@6 -g

case "${TRAVIS_OS_NAME}" in
  osx)
    gem install cocoapods -v 1.4.0
    travis_wait pod repo update --silent
  ;;
esac

npm install -g react-native-cli

# Test propTypes
npm install
npm test

# Remove existing tarball
rm -rf *.tgz

# Create new tarball
npm pack

init_new_example_project
