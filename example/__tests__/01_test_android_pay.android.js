import test from 'tape-async'
import helper from 'tipsi-appium-helper'

const { driver, idFromAccessId } = helper

test('Test if user can use Android Pay', async (t) => {
  const tabAndroidPay = idFromAccessId('Android Pay')
  const androidPayButton = idFromAccessId('androidPayButton')

  try {
    await driver.waitForVisible(tabAndroidPay, 100000)
    await driver.click(tabAndroidPay)

    await driver.waitForVisible(androidPayButton, 15000)

    t.pass('User should see `Pay with Android Pay` button')

    // to be continued ...
  } catch (error) {
    await helper.screenshot()
    await helper.source()

    throw error
  }
})
