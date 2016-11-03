import { remote } from 'webdriverio'

export default async function (config) {
  if (this.driver) {
    return
  }
  this.config = config
  this.driver = remote({
    desiredCapabilities: {
      deviceName: config.deviceName,
      platformName: config.platformName,
      platformVersion: config.platformVersion,
      app: config.app,
      noReset: config.noReset,
      automationName: 'xcuitest',
      newCommandTimeout: 360,
    },
    logLevel: 'debug',
    path: '/wd/hub',
    host: config.appiumHost,
    port: config.appiumPort,
  })
  await this.driver.init()
}
