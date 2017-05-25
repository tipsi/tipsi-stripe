import helper from 'tipsi-appium-helper'
import test from './utils/tape'
import openTestSuite from './common/openTestSuite'

const { driver, idFromAccessId } = helper

test('Test if user can use Apple Pay', async (t) => {
  const applePayButtonId = idFromAccessId('applePayButton')
  const applePaySwitchId = idFromAccessId('applePaySwitch')
  const payWithPasscodeButtonId = idFromAccessId('Pay with Passcode')
  const statusId = idFromAccessId('applePayStatus')
  const tokenId = idFromAccessId('applePayToken')
  const setupApplePayButtonId = idFromAccessId('setupApplePayButton')

  await openTestSuite('Pay')

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

  await driver.waitForVisible(setupApplePayButtonId, 30000)
  t.pass('User should see `Setup Pay` button')

  await driver.click(setupApplePayButtonId)
  t.pass('User should be able to tap on `Setup Pay` button')

  await driver.waitForVisible(setupApplePayButtonId, 30000)
  t.pass('User should still see `Setup Pay` button')
})
