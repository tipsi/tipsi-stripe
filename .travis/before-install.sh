#!/bin/bash

init_new_example_project() {
  proj_dir_old=example
  proj_dir_new=example_tmp

  react_native_version=$(cat $proj_dir_old/package.json | sed -n 's/"react-native": "\(\^|~\)*\(.*\)",*/\2/p')

  files_to_copy=(
    package.json
    index.{ios,android}.js
    android/app/build.gradle
    src
    scripts
    tests
  )

  mkdir tmp
  cd tmp
  react-native init $proj_dir_old --version $react_native_version
  cd ..
  mv tmp/$proj_dir_old $proj_dir_new

  for i in ${files_to_copy[@]}; do
    if [ -e $proj_dir_old/$i ]; then
      cp -Rp $proj_dir_old/$i $proj_dir_new/$i
    fi
  done
}

case "${TRAVIS_OS_NAME}" in
  osx)
    $HOME/.nvm/nvm.sh
    nvm install 6.8.1
    gem install cocoapods -v 1.1.1
    travis_wait pod repo update --silent
    npm install -g react-native-cli
    init_new_example_project
  ;;
  linux)
    $HOME/.nvm/nvm.sh
    nvm install 6.8.1
    npm install -g react-native-cli
    init_new_example_project
  ;;
esac
