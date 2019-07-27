import helper from 'tipsi-appium-helper'
import test from './utils/tape'
import openTestSuite from './common/openTestSuite'
import nativeClick from './common/nativeClick'
import clickUntilVisible from './common/clickUntilVisible'
import idFromLabel from './common/idFromLabel'
import swipeUp from './common/swipeUp'

const { driver, idFromAccessId, idFromText, platform, select, swipe, screenshot } = helper
const idFromContentDesc = text => `//*[@content-desc="${text}"]`  // TODO move to tipsi-appium-helper

const timeout = 300000

test('Test if user can create a source object for a card', async (t) => {
  await openTestSuite('Sources')

  const sourceButtonId = idFromAccessId('cardSourceButton')

  await driver.waitForVisible(sourceButtonId, timeout)
  t.pass('User should see `Create a source with params` button')

  await driver.click(sourceButtonId)
  t.pass('User should be able to tap on `Create source for card payment` button')

  const sourceObjectId = idFromAccessId('sourceObject')
  await driver.waitForVisible(sourceObjectId, timeout)
})

const alipay = async (t, target) => {
  try {
    await openTestSuite('Sources')

    const sourceButtonId = idFromAccessId('sourceButton')

    await driver.waitForVisible(sourceButtonId, timeout)
    t.pass('User should see `Create a source with params` button')

    await driver.click(sourceButtonId)
    t.pass('User should be able to tap on `Create source for Alipay payment` button')

    const title = select({
      ios: idFromLabel,
      android: idFromContentDesc,
    })('Alipay test payment page')

    await driver.waitForVisible(title, timeout)
    t.pass('User should be able to see `Alipay test payment page`')

    await swipeUp(title)
    t.pass('User can swipe up')

    const testPaymentButtonId = select({
      ios: idFromLabel,
      android: idFromContentDesc,
    })(target)

    await driver.waitForVisible(testPaymentButtonId, timeout)

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

    // Note: 'Return to Merchant' may be prefixed with 'arrow--left--white ' in some versions of Android
    const returnToTheAppButtonId = select({
      ios: idFromLabel,
      android: idFromContentDesc,
    })(select({ ios: 'Return to example', android: 'arrow--left--white Return to Merchant' }))

    await driver.waitForVisible(returnToTheAppButtonId, timeout)
    await driver.click(returnToTheAppButtonId)
    t.pass('User should click on "Return to example" button')

    if (platform('ios')) {
      const openButtonId = idFromLabel('Open')
      await driver.waitForVisible(openButtonId, timeout)
      await driver.click(openButtonId)
      t.pass('User should click on "Open" button')
    }
  } catch (e) {
    console.log(e)
    console.log(await driver.source())
    throw e
  }
}


test('Test if user can authorize test payment on a source object for Alipay', async (t) => {

  await alipay(t, 'AUTHORIZE TEST PAYMENT')
})

// Currently failing because the TextView example app with the 'Create source for Alipay payment'
// button is not clickable after the previous test.
/*
test('Test if user can fail test payment on a source object for Alipay', async (t) => {
  await alipay(t, 'FAIL TEST PAYMENT')
})
*/
