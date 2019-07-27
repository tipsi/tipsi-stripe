#!/bin/bash

android-wait-for-emulator() {
  set +e

  bootanim=""
  failcounter=0
  timeout_in_sec=900

  until [[ "$bootanim" =~ "stopped" ]]; do
    bootanim=`adb -e shell getprop init.svc.bootanim 2>&1 &`
    if [[ "$bootanim" =~ "device not found" || "$bootanim" =~ "device offline"
      || "$bootanim" =~ "running" ]]; then
      let "failcounter += 1"
      echo "Waiting for emulator to start"
      if [[ $failcounter -gt timeout_in_sec ]]; then
        echo "Timeout ($timeout_in_sec seconds) reached; failed to start emulator"
        exit 1
      fi
    fi
    sleep 1
  done

  echo "Emulator is ready"
}

screenshot() {
    filename=screencap.png
    rm ./$filename
    adb shell screencap -p /sdcard/$filename
    adb pull /sdcard/$filename ./$filename
    npx imgur-upload-cli ./$filename
}

case "${TRAVIS_OS_NAME}" in
  linux)
    export ANDROID_HOME=~/android-sdk
    export PATH=${PATH}:${ANDROID_HOME}/emulator:${ANDROID_HOME}/tools:${ANDROID_HOME}/tools/bin:${ANDROID_HOME}/platform-tools

    # Cleanup (if rerun)
    adb -s emulator-5554 emu kill || true
    adb kill-server || true
    avdmanager delete avd -n ${EMULATOR_NAME} || true
    adb start-server || true

    echo "Creating AVD ${EMULATOR_NAME} for image ${EMULATOR}"
    echo no | avdmanager create avd --force -n ${EMULATOR_NAME} -k "${EMULATOR}"
    cp "example/android/avd/android-${EMULATOR_API_LEVEL}-config.ini" ~/.android/avd/${EMULATOR_NAME}.avd/config.ini

    echo "Using config.ini:"
    cat ~/.android/avd/${EMULATOR_NAME}.avd/config.ini

    echo "Starting emulator"
    # Run emulator in a subshell, this seems to solve the travis QT issue
    ( ${ANDROID_HOME}/emulator/emulator -avd ${EMULATOR_NAME} -memory 3072 -verbose -show-kernel -selinux permissive -no-audio -no-window -gpu swiftshader_indirect -wipe-data > /dev/null 2>&1 & )

    android-wait-for-emulator
    echo "Sleeping for 120s"
    sleep 120
    screenshot
    adb shell input keyevent 82 &
    adb shell settings put global window_animation_scale 0 &
    adb shell settings put global transition_animation_scale 0 &
    adb shell settings put global animator_duration_scale 0 &
    adb devices

    # Prevent 'ENOSPC: System limit for number of file watchers reached' error
    echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p || true

    cd example_tmp
    npm run configure

    echo "Running build:android"
    screenshot
    npm run build:android

    echo "Starting appium"
    node_modules/.bin/appium --session-override > "${ANDROID_HOME}/appium.out" &

    echo "Running test:android"
    screenshot
    npm run test:android
  ;;
  osx)
    echo "Starting appium"
    example_tmp/node_modules/.bin/appium --session-override > "${ANDROID_SDK_ROOT}/appium.out" &

    cd example_tmp
    npm run configure

    set -o pipefail && npm run build:ios | xcpretty -c -f `xcpretty-travis-formatter`
    npm run test:ios

  ;;
esac

