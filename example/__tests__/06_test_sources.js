import helper from 'tipsi-appium-helper'
import test from './utils/tape'
import openTestSuite from './common/openTestSuite'
import nativeClick from './common/nativeClick'
import clickUntilVisible from './common/clickUntilVisible'
import idFromLabel from './common/idFromLabel'

const { driver, idFromAccessId, platform, select } = helper

test('Test if user can create a source object for a card', async (t) => {
  await openTestSuite('Sources')

  const sourceButtonId = idFromAccessId('cardSourceButton')

  await driver.waitForVisible(sourceButtonId, 60000)
  t.pass('User should see `Create a source with params` button')

  await driver.click(sourceButtonId)
  t.pass('User should be able to tap on `Create source for card payment` button')

  const sourceObjectId = idFromAccessId('sourceObject')
  await driver.waitForVisible(sourceObjectId, 90000)
})

test('Test if user can create a source object for Alipay', async (t) => {
  const expectedSourcesResults = [false, true]

  await openTestSuite('Sources')

  for (const sourcesVisibility of expectedSourcesResults) {
    const sourceButtonId = idFromAccessId('sourceButton')

    await driver.waitForVisible(sourceButtonId, 60000)
    t.pass('User should see `Create a source with params` button')

    await driver.click(sourceButtonId)
    t.pass('User should be able to tap on `Create source for Alipay payment` button')

    const testPaymentButtonId = select({
      ios: idFromLabel,
      android: idFromAccessId,
    })(sourcesVisibility ? 'AUTHORIZE TEST PAYMENT' : 'FAIL TEST PAYMENT')

    await driver.waitForVisible(testPaymentButtonId, 90000)

    if (platform('android')) {
      const testPaymentButton = await driver.element(testPaymentButtonId)
      const { value: buttonCoords } = await driver.elementIdLocation(
        testPaymentButton.value.ELEMENT
      )

      await nativeClick(buttonCoords.x + 10, buttonCoords.y + 10)
    } else {
      await clickUntilVisible({ selector: testPaymentButtonId })
    }

    t.pass('User should click on "Authorize Test Payment" button')

    const returnToTheAppButtonId = select({
      ios: idFromLabel,
      android: idFromAccessId,
    })(select({ ios: 'Return to example', android: ' Return to Merchant' }))

    await driver.waitForVisible(returnToTheAppButtonId, 60000)
    await driver.click(returnToTheAppButtonId)
    t.pass('User should click on "Return to example" button')

    if (platform('ios')) {
      const openButtonId = idFromLabel('Open')
      await driver.waitForVisible(openButtonId, 60000)
      await driver.click(openButtonId)
      t.pass('User should click on "Open" button')
    }
  }
})
