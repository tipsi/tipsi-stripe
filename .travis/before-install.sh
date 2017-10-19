#!/bin/bash

init_new_example_project() {
  proj_dir_old=example
  proj_dir_new=example_tmp

  react_native_version=$(cat $proj_dir_old/package.json | sed -n 's/"react-native": "\(\^|~\)*\(.*\)",*/\2/p')

  files_to_copy=(
    .appiumhelperrc
    package.json
    index.{ios,android}.js
    android/app/build.gradle
    src
    scripts
    __tests__
    ios/Podfile
  )

  mkdir tmp
  cd tmp
  react-native init $proj_dir_old --version $react_native_version
  rm -rf $proj_dir_old/__tests__
  cd ..
  mv tmp/$proj_dir_old $proj_dir_new

  for i in ${files_to_copy[@]}; do
    if [ -e $proj_dir_old/$i ]; then
      cp -Rp $proj_dir_old/$i $proj_dir_new/$i
    fi
  done
}

$HOME/.nvm/nvm.sh
nvm install 8.4.0
npm i npm@5 -g

case "${TRAVIS_OS_NAME}" in
  osx)
    gem install cocoapods -v 1.1.1
    travis_wait pod repo update --silent
  ;;
esac

npm install -g react-native-cli

library_name=$(node -p "require('./package.json').name")
library_version=$(node -p "require('./package.json').version")

# Remove existing tarball
rm -rf *.tgz

# Create new tarball
npm pack

tarball_name="$library_name-$library_version.tgz" ./scripts/replaceToTarball.js

init_new_example_project
