import findAndroidDevice from './find-android-device'
import findiOSDevice from './find-ios-device'
import appiumIsRunning from './appium-is-running'
import runTapeTests from './run-tape-tests'
import helper from './helper'

const {
  APPIUM_HOST = '0.0.0.0',
  APPIUM_PORT = '4723',
  TESTS_PATH = 'test/*_test_*.js',
  APP_PATH,
  PLATFORM_NAME,
  NO_RESET,
  AUTOMATION_NAME,
  IMGUR_CLIENT_ID,
  PASTEBIN_DEV_KEY,
  IOS_DEVICE_NAME,
  IOS_PLATFORM_VERSION,
  ANDROID_DEVICE_NAME,
  ANDROID_PLATFORM_VERSION,
} = process.env

let DEVICE_NAME = process.env.DEVICE_NAME
let PLATFORM_VERSION = process.env.PLATFORM_VERSION

const allowedPlatformNames = ['ios', 'android'];

/* eslint no-console: 0 */
(async function run() {
  process.on('SIGINT', async () => {
    // Close Helper
    await helper.release()
    process.exit()
  })

  try {
    // Check Appium
    await appiumIsRunning(APPIUM_HOST, APPIUM_PORT)
    console.log(`Appium is running on: ${APPIUM_HOST}:${APPIUM_PORT}`)

    // Check Platform Name
    if (!PLATFORM_NAME) {
      console.log('PLATFORM_NAME is not specified')
      return
    }
    if (!allowedPlatformNames.includes(PLATFORM_NAME)) {
      console.log(`PLATFORM_NAME should be one of: ${allowedPlatformNames}`)
      return
    }

    // Check APP file
    if (!APP_PATH) {
      console.log('APP_PATH is not specified')
      return
    }

    if (PLATFORM_NAME === 'android') {
      DEVICE_NAME = ANDROID_DEVICE_NAME || DEVICE_NAME
      PLATFORM_VERSION = ANDROID_PLATFORM_VERSION || PLATFORM_VERSION
    }
    if (PLATFORM_NAME === 'ios') {
      DEVICE_NAME = IOS_DEVICE_NAME || DEVICE_NAME
      PLATFORM_VERSION = IOS_PLATFORM_VERSION || PLATFORM_VERSION
    }

    // Check Device Name
    const deviceNotSpecified = !DEVICE_NAME || !PLATFORM_VERSION
    if (deviceNotSpecified && PLATFORM_NAME === 'android') {
      const device = await findAndroidDevice()
      console.log(`Found next Android device: ${device.id}, version: ${device.version}`)
      DEVICE_NAME = device.id
      PLATFORM_VERSION = device.version
    }
    if (PLATFORM_NAME === 'ios') {
      const device = await findiOSDevice(DEVICE_NAME, PLATFORM_VERSION)
      console.log(`Found next iOS device: ${device.type}, version: ${device.version}`)
      DEVICE_NAME = device.type
      PLATFORM_VERSION = device.version
    }

    // Initialize Helper
    await helper.init({
      appiumHost: APPIUM_HOST,
      appiumPort: APPIUM_PORT,
      deviceName: DEVICE_NAME,
      platformName: PLATFORM_NAME,
      platformVersion: PLATFORM_VERSION,
      app: APP_PATH,
      noReset: !!NO_RESET,
      automationName: AUTOMATION_NAME,
      imgur: IMGUR_CLIENT_ID,
      pastebin: PASTEBIN_DEV_KEY,
    })

    // Run Tape tests
    await runTapeTests(TESTS_PATH)

    // Close Helper
    await helper.release()
  } catch (error) {
    console.log('Error while executing tests:')
    console.log(error)

    // Close Helper
    await helper.release()
    // Exit with failure code
    process.exit(1)
  }
}())
