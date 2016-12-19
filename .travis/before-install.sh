#!/bin/bash

init_new_example_project() {
  proj_dir_old=example
  proj_dir_new=example_tmp

  react_native_ver=$(cd $proj_dir_old && npm view react-native version)

  files_to_copy=(
    $proj_dir_old/package.json
    $proj_dir_old/index.*.js
    $proj_dir_old/android/app/build.gradle
    $proj_dir_old/src
    $proj_dir_old/scripts
    $proj_dir_old/test
  )

  mkdir $proj_dir_new tmp
  cd tmp
  react-native init $proj_dir_new --version $react_native_ver
  cd ..
  mv tmp/$proj_dir_old $proj_dir_new

  for i in ${files_to_copy[@]}; do
    if [ -e $i ]; then
      cp -rp $i $proj_dir_new
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
