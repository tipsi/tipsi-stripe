import helper from 'tipsi-appium-helper'
import test from './utils/tape'
import openTestSuite from './common/openTestSuite'

const { driver, select, platform, idFromAccessId, idFromResourceId } = helper

const timeout = 60000

test('Test if user can use Card Form', async (t) => {

  const cardFormButton = idFromAccessId('cardFormButton')
  const numberInputId = select({
    ios: idFromAccessId('card number'),
    android: idFromResourceId('com.example:id/cc_card'),
  })

  const inputExpData = select({
    ios: idFromAccessId('expiration date'),
    android: idFromResourceId('com.example:id/cc_exp'),
  })

  const inputCVC = select({
    ios: idFromAccessId('CVC'),
    android: idFromResourceId('com.example:id/cc_ccv'),
  })

  const doneButtonId = select({
    ios: idFromAccessId('Done'),
    android: idFromResourceId('android:id/button1'),
  })
  const nextButtonId = idFromAccessId('Next')
  const paymentMethodResultId = idFromAccessId('cardFormPaymentMethod')

  await openTestSuite('Card Form')

  let elem = await driver.$(cardFormButton)
  await elem.waitForDisplayed(timeout)
  t.pass('User should see `Enter you card and pay` button')

  await elem.click()
  t.pass('User should be able to tap on `Enter you card and pay` button')

  // Enter credit card number
  elem = await driver.$(numberInputId)
  await elem.waitForDisplayed(timeout)
  t.pass(`Element ${numberInputId} is visible`)
  await elem.click()

  elem.setValue("4242424242424242")
  t.pass("User has keyed in their credit card number")


  // Enter credit card expiry
  elem = await driver.$(inputExpData)
  await elem.waitForDisplayed(timeout)
  t.pass(`Element ${inputExpData} is visible`)

  await elem.click()
  elem = await driver.$(inputExpData)
  await elem.click()
  elem.setValue('12/34')
  t.pass("User has keyed in the card's expiry date")

  // Enter credit card CVC
  elem = await driver.$(inputCVC)
  await elem.waitForDisplayed(timeout)
  t.pass(`Element ${inputCVC} is visible`)

  elem.setValue('123')
  t.pass("User has keyed in the CVC")

  // Iterate over billing address fields (iOS only)
  // Verifies that all fields are filled
  if (platform('ios')) {
    for (const index of new Array(7)) { // eslint-disable-line no-unused-vars
      elem = await driver.$(nextButtonId)
      await elem.waitForDisplayed(timeout)
      await elem.click()
    }
  }

  elem = await driver.$(doneButtonId)
  await elem.waitForEnabled(timeout)
  await elem.click()
  t.pass('User should be able to tap on `Done` button')

  // Sometimes on Travis we have a problem with the network connection,
  // it is related to problems with current container or slow android emulator
  if (platform('android')) {
    try {
       elem = await driver.$(paymentMethodResultId)
       await elem.waitForDisplayed(180000)
    } catch (error) {
      try {
        t.pass('Payment Method does not exist, try click done button again')
        elem = await driver.$(doneButtonId)
        await elem.waitForDisplayed(50000)
        elem.click()
      } catch (error) { // eslint-disable-line no-shadow, no-empty
        t.pass('Done button does not exist, wait for payment method')
      }
    }
  }

  elem = await driver.$(paymentMethodResultId)
  await elem.waitForDisplayed(50000)
  t.pass('User should see Payment Method')
})
