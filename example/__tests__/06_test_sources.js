import helper from 'tipsi-appium-helper'
import test from './utils/tape'
import openTestSuite from './common/openTestSuite'
import nativeClick from './common/nativeClick'
import clickUntilVisible from './common/clickUntilVisible'
import idFromLabel from './common/idFromLabel'

const { driver, idFromAccessId, idFromText, platform, select, screenshot } = helper
const idFromContentDesc = text => `//*[@content-desc="${text}"]`  // TODO move to tipsi-appium-helper

const timeout = 300000

test('Test if user can create a source object for a card', async (t) => {
  await openTestSuite('Sources')

  const sourceButtonId = idFromAccessId('cardSourceButton')

  let elem = await driver.$(sourceButtonId)
  await elem.waitForDisplayed(timeout)
  t.pass('User should see `Create a source with params` button')

  await elem.click()
  t.pass('User should be able to tap on `Create source for card payment` button')

  const sourceObjectId = idFromAccessId('sourceObject')
  elem = await driver.$(sourceObjectId)
  await elem.waitForDisplayed(timeout)
})

const alipay = async (t, target) => {

  await openTestSuite('Sources')

  const sourceButtonId = idFromAccessId('sourceButton')

  let elem = await driver.$(sourceButtonId)
  await elem.waitForDisplayed(timeout)
  t.pass('User should see `Create a source with params` button')

  await elem.click()
  t.pass('User should be able to tap on `Create source for Alipay payment` button')

  const title = select({
    ios: idFromLabel,
    android: idFromContentDesc,
  })('Alipay test payment page')

  elem = await driver.$(title)
  await elem.waitForDisplayed(timeout)
  t.pass('User should be able to see `Alipay test payment page`')

  const testPaymentButtonId = select({
    ios: idFromLabel,
    android: idFromContentDesc,
  })(target)

  elem = await driver.$(testPaymentButtonId)
  await elem.waitForDisplayed(timeout)

  if (platform('android')) {
    const testPaymentButton = await driver.$(testPaymentButtonId)
    const loc = await testPaymentButton.getLocation()

    await nativeClick(loc.x + 10, loc.y + 10)
  } else {
    await clickUntilVisible({ selector: testPaymentButtonId })
  }

  t.pass('User should click on "Authorize Test Payment" button')

  // Note: 'Return to Merchant' may be prefixed with 'arrow--left--white ' in some versions of Android
  const returnToTheAppButtonId = select({
    ios: idFromLabel,
    android: text => `//*[contains(@content-desc, '${text}')]`,
  })(select({ ios: 'Return to example', android: 'Return to Merchant' }))

  elem = await driver.$(returnToTheAppButtonId)
  await elem.waitForDisplayed(timeout)
  await elem.click()
  t.pass('User should click on "Return to example" button')

  if (platform('ios')) {
    const openButtonId = idFromLabel('Open')
    elem = await driver.$(openButtonId)
    await elem.waitForDisplayed(timeout)
    await elem.click()
    t.pass('User should click on "Open" button')
  }
}


test('Test if user can authorize test payment on a source object for Alipay', async (t) => {
  await alipay(t, 'AUTHORIZE TEST PAYMENT')
})

test('Test if user can fail test payment on a source object for Alipay', async (t) => {
  await alipay(t, 'FAIL TEST PAYMENT')
})
