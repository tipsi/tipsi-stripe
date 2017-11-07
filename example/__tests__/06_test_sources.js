import helper from 'tipsi-appium-helper'
import test from './utils/tape'
import openTestSuite from './common/openTestSuite'
import swipeUp from './common/swipeUp'
import idFromLabel from './common/idFromLabel'

const { driver, idFromAccessId } = helper

test('Test if user can create a source object for Alipay', async (t) => {
  const expectedSourcesResults = [false, true]

  await openTestSuite('Sources')

  for (const sourcesVisibility of expectedSourcesResults) {
    const sourceButtonId = idFromAccessId('sourceButton')
    const sourceObject = idFromAccessId('sourceObject')

    await driver.waitForVisible(sourceButtonId, 60000)
    t.pass('User should see `Create a source with params` button')

    await driver.click(sourceButtonId)
    t.pass('User should be able to tap on `Create source for Alipay payment` button')

    const paymentParametersHeaderId = idFromLabel('Payment parameters')
    await driver.waitForVisible(paymentParametersHeaderId, 60000)
    await swipeUp(paymentParametersHeaderId, 300)
    t.pass('User should swipe to button')

    const testPaymentButtonId = sourcesVisibility
      ? idFromLabel('Authorize Test Payment')
      : idFromLabel('Fail Test Payment')
    await driver.waitForVisible(testPaymentButtonId, 60000)
    await driver.click(testPaymentButtonId)
    t.pass('User should click on "Authorize Test Payment" button')

    const returnToTheAppButtonId = idFromLabel('Return to example')
    await driver.waitForVisible(returnToTheAppButtonId, 60000)
    await driver.click(returnToTheAppButtonId)
    t.pass('User should click on "Return to example" button')

    const openButtonId = idFromLabel('Open')
    await driver.waitForVisible(openButtonId, 60000)
    await driver.click(openButtonId)
    t.pass('User should click on "Open" button')

    await driver.waitForVisible(sourceObject, 60000, !sourcesVisibility)
    t.pass('User should see source object')
  }
})
