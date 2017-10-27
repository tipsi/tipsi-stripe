#!/bin/bash

case "${TRAVIS_OS_NAME}" in
  linux)
    echo no | android create avd --force -n test -t android-21 --abi armeabi-v7a --skin WVGA800
    emulator -avd test -scale 96dpi -dpi-device 160 -no-audio -no-window &
    android-wait-for-emulator
    sleep 60
    adb shell input keyevent 82 &
    $ANDROID_HOME/tools/bin/sdkmanager "build-tools;25.0.1"
    $ANDROID_HOME/tools/bin/sdkmanager "build-tools;25.0.2"
    $ANDROID_HOME/tools/bin/sdkmanager "build-tools;25.0.3"
    $ANDROID_HOME/tools/bin/sdkmanager "build-tools;25.2.3"
    $ANDROID_HOME/tools/bin/sdkmanager "build-tools;25.2.5"
  ;;
esac

example_tmp/node_modules/.bin/appium --session-override > appium.out &
