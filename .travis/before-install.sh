#!/bin/bash

init_new_example_project() {
  proj_dir_old=example
  proj_dir_new=example_tmp

  react_native_version=$(cat $proj_dir_old/package.json | sed -n 's/"react-native": "\(\^|~\)*\(.*\)",*/\2/p')

  files_to_copy=(
    .appiumhelperrc
    package.json
    package-lock.json
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

  mkdir tmp
  cd tmp
  react-native init $proj_dir_old --version $react_native_version
  rm -rf $proj_dir_old/__tests__
  cd ..
  rm -rf $proj_dir_new
  mv tmp/$proj_dir_old $proj_dir_new
  rm -rf tmp

  echo "Copying $proj_dir_old files into $proj_dir_new"
  for i in ${files_to_copy[@]}; do
    if [ -e $proj_dir_old/$i ]; then
      cp -Rp $proj_dir_old/$i $proj_dir_new/$i
    fi
  done
}

export NODEJS_ORG_MIRROR=http://nodejs.org/dist

sudo apt-get install openjdk-8-jdk

echo "Installing npm@6.10.3"
sudo npm i npm@6.10.3 -g


case "${TRAVIS_OS_NAME}" in
  osx)
    echo "Installing cocoapods"
    gem install cocoapods -v 1.4.0
    travis_wait pod repo update --silent
  ;;
  linux)

    ANDROID_TOOLS=4333796 # android-28
    export ANDROID_HOME=~/android-sdk
    export ANDROID_SDK_ROOT=~/android-sdk

    echo "### Downloading android tools"
    wget -q "https://dl.google.com/android/repository/sdk-tools-linux-$ANDROID_TOOLS.zip" -O android-sdk-tools.zip

    echo "### Unzipping android tools"
    sudo apt install -y unzip
    unzip -oq android-sdk-tools.zip -d ${ANDROID_HOME}

    echo "### Removing android-sdk-tools.zip"
    rm android-sdk-tools.zip

    export PATH=${PATH}:${ANDROID_HOME}/emulator:${ANDROID_HOME}/tools:${ANDROID_HOME}/tools/bin:${ANDROID_HOME}/platform-tools
    echo "### PATH set to $PATH"

    # Silence warning.
    mkdir -p ~/.android
    touch ~/.android/repositories.cfg


    echo "### Installing platforms;android-${COMPILE_API_LEVEL} required by compiler"
    yes | sdkmanager "platforms;android-${COMPILE_API_LEVEL}" > /dev/null

    echo "### Installing platforms;${EMULATOR_API_LEVEL}"
    yes | sdkmanager "platforms;android-${EMULATOR_API_LEVEL}" > /dev/null

    echo "### Installing tools"
    yes | sdkmanager "tools" > /dev/null

    echo "### Installing platform-tools"
    yes | sdkmanager "platform-tools" > /dev/null

    echo "### Installing emulator"
    yes | sdkmanager "emulator" > /dev/null

    echo "### Installing extras;android;m2repository"
    yes | sdkmanager "extras;android;m2repository" > /dev/null

    echo "### Installing extras;google;m2repository"
    yes | sdkmanager "extras;google;m2repository" > /dev/null

    echo "### Installing extras;google;google_play_services"
    yes | sdkmanager "extras;google;google_play_services" > /dev/null

    echo "### Installing build-tools;${ANDROID_BUILD_TOOLS_VERSION}"
    yes | sdkmanager "build-tools;${ANDROID_BUILD_TOOLS_VERSION}" > /dev/null

    echo "### Installing ${EMULATOR} system image"
    yes | sdkmanager "${EMULATOR}" > /dev/null

    sdkmanager --list | head -30  # Print out package list for debug purposes
  ;;
esac

echo "Installing react-native-cli"
sudo npm install -g react-native-cli

# Test propTypes
echo "Calling npm ci"
npm ci

echo "Calling npm test"
npm test

echo "Removing existing tarball"
rm -rf *.tgz

echo "Creating a new tarball"
npm pack

init_new_example_project
