import { remote } from 'webdriverio'

export default async function (config) {
  if (this.driver) {
    return
  }
  this.config = config
  this.driver = remote({
    desiredCapabilities: {
      appiumVersion: '1.5.3',
      deviceName: config.deviceName,
      platformName: config.platformName,
      platformVersion: config.platformVersion,
      app: config.app,
      noReset: config.noReset,
      automationName: 'xcuitest',
    },
    logLevel: 'debug',
    path: '/wd/hub',
    host: config.appiumHost,
    port: config.appiumPort,
  })
  await this.driver.init()
}
