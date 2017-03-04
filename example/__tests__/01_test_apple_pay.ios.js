import test from 'tape-async'
import helper from 'tipsi-appium-helper'

const { driver, idFromXPath, idFromAccessId } = helper

test('Test if user can use Apple Pay', async (t) => {
  const applePayTabId = idFromXPath('//XCUIElementTypeScrollView[1]/*/XCUIElementTypeOther[1]')
  const applePayButtonId = idFromAccessId('applePayButton')
  const payWithPasscodeButtonId = idFromAccessId('Pay with Passcode')
  const tokenId = idFromAccessId('applePayToken')

  try {
    await driver.waitForVisible(applePayTabId, 60000)
    await driver.click(applePayTabId)

    await driver.waitForVisible(applePayButtonId, 5000)

    t.pass('User should see `Pay with Pay` button')

    await driver.click(applePayButtonId)

    t.pass('User should be able to tap on `Pay with Pay` button')

    await driver.waitForVisible(payWithPasscodeButtonId, 10000)

    t.pass('User should see Pay form')

    await driver.click(payWithPasscodeButtonId)

    t.pass('User should accept Pay payment')

    await driver.waitForVisible(tokenId, 30000)

    t.pass('User should see token')
  } catch (error) {
    await helper.screenshot()
    await helper.source()

    throw error
  }
})
