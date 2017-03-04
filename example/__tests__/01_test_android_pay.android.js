import test from 'tape-async'
import helper from 'tipsi-appium-helper'

const { driver, idFromAccessId } = helper

test('Test if user can use Android Pay', async (t) => {
  const tabAndroidPay = idFromAccessId('headerTab_0')
  const androidPayButton = idFromAccessId('androidPayButton')

  try {
    await driver.waitForVisible(tabAndroidPay, 70000)
    await driver.click(tabAndroidPay)

    await driver.waitForVisible(androidPayButton, 10000)

    t.pass('User should see `Pay with Android Pay` button')

    // to be continued ...
  } catch (error) {
    await helper.screenshot()
    await helper.source()

    throw error
  }
})
