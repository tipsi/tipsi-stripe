#!/bin/bash

case "${TRAVIS_OS_NAME}" in
  osx)
    example/node_modules/.bin/appium --session-override > appium.out &
  ;;
  linux)
        echo no | android create avd --force -n test -t android-21 --abi armeabi-v7a --skin WVGA800
    emulator -avd test -scale 96dpi -dpi-device 160 -no-audio -no-window &
    android-wait-for-emulator
    sleep 60
    adb shell input keyevent 82 &
    example/node_modules/.bin/appium --session-override > appium.out &
  ;;
esac
