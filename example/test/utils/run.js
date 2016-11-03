import findAndroidDevice from './find-android-device'
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

    // Check Device Name
    const deviceNotSpecified = !DEVICE_NAME || !PLATFORM_VERSION
    if (deviceNotSpecified && PLATFORM_NAME === 'android') {
      const device = await findAndroidDevice()
      console.log(`Found next android device: ${device.id}, version: ${device.version}`)
      DEVICE_NAME = device.id
      PLATFORM_VERSION = device.version
    }
    if (deviceNotSpecified && PLATFORM_NAME === 'ios') {
      DEVICE_NAME = 'iPhone 6'
      PLATFORM_VERSION = '10.0'
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
