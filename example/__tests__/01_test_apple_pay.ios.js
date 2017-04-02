import test from 'tape-async'
import helper from 'tipsi-appium-helper'

const { driver, idFromAccessId } = helper

test('Test if user can use Apple Pay', async (t) => {
  const applePayTabId = idFromAccessId('Pay')
  const applePayButtonId = idFromAccessId('applePayButton')
  const applePaySwitchId = idFromAccessId('applePaySwitch')
  const payWithPasscodeButtonId = idFromAccessId('Pay with Passcode')
  const statusId = idFromAccessId('applePayStatus')
  const tokenId = idFromAccessId('applePayToken')

  try {
    await driver.waitForVisible(applePayTabId, 60000)
    await driver.click(applePayTabId)

    await driver.waitForVisible(applePayButtonId, 30000)
    t.pass('User should see `Pay with Pay` button')

    await driver.click(applePayButtonId)
    t.pass('User should be able to tap on `Pay with Pay` button')

    await driver.waitForVisible(payWithPasscodeButtonId, 30000)
    t.pass('User should see Pay form')

    await driver.click(payWithPasscodeButtonId)
    t.pass('User should accept Pay payment')

    await driver.waitForVisible(tokenId, 60000)
    t.pass('User should see token')

    t.equal(
      await driver.waitForVisible(statusId).getText(statusId),
      'Apple Pay payment completed',
      'Apple Pay payment should be completed'
    )

    await driver.click(applePaySwitchId)
    t.pass('User should be able to tap on `Complete/Cancel` switch')

    await driver.click(applePayButtonId)
    t.pass('User should be able to tap on `Pay with Pay` button')

    await driver.waitForVisible(payWithPasscodeButtonId, 30000)
    t.pass('User should see Pay form')

    await driver.click(payWithPasscodeButtonId)
    t.pass('User should accept Pay payment')

    await driver.waitForVisible(tokenId, 60000)
    t.pass('User should see token')

    t.equal(
      await driver.waitForVisible(statusId).getText(statusId),
      'Apple Pay payment cenceled',
      'Apple Pay payment should be cenceled'
    )
  } catch (error) {
    await helper.screenshot()
    await helper.source()

    throw error
  }
})
