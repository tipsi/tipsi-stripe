#!/bin/bash

case "${TRAVIS_OS_NAME}" in
  linux)
    case "${ANDROID_VERSION}" in
      21)
        echo no | android create avd --force -n test -t android-${ANDROID_VERSION} --abi armeabi-v7a --skin WVGA800
      ;;
      26)
        echo no | android create avd --force -n test -t android-${ANDROID_VERSION} --abi "google_apis/armeabi-v7a" --skin WVGA800
      ;;
    esac
    emulator -avd test -scale 96dpi -dpi-device 160 -no-window &
    android-wait-for-emulator
    sleep 60
    adb shell input keyevent 82 &
  ;;
esac

example_tmp/node_modules/.bin/appium --session-override > appium.out &
