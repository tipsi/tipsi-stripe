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
  const tokenId = idFromAccessId('cardFormToken')

  await openTestSuite('Card Form')

  await driver.waitForVisible(cardFormButton, timeout)
  t.pass('User should see `Enter you card and pay` button')

  await driver.click(cardFormButton)
  t.pass('User should be able to tap on `Enter you card and pay` button')

  // Enter credit card number
  await driver.waitForVisible(numberInputId, timeout)
  t.pass(`Element ${numberInputId} is visible`)

  await driver.click(numberInputId)
  t.pass(`Element ${numberInputId} is clicked`)

  await driver.waitForVisible(numberInputId, timeout)   // Fixes an issue that appears in Android 23 tests
  t.pass(`Element ${numberInputId} is still visible`)

  await driver.keys('4242424242424242')
  t.pass("User has keyed in their credit card number")


  // Enter credit card expiry
  await driver.waitForVisible(inputExpData, timeout)
  t.pass(`Element ${inputExpData} is visible`)
  await driver.keys('12/34')
  t.pass("User has keyed in the card's expiry date")


  // Enter credit card CVC
  await driver.waitForVisible(inputCVC, timeout)
  t.pass(`Element ${inputCVC} is visible`)
  await driver.keys('123')
  t.pass("User has keyed in the CVC")

  // Iterate over billing address fields (iOS only)
  // Verifies that all fields are filled
  if (platform('ios')) {
    for (const index of new Array(7)) { // eslint-disable-line no-unused-vars
      await driver.waitForVisible(nextButtonId, timeout)
      await driver.click(nextButtonId)
    }
  }

  await driver.waitForEnabled(doneButtonId, timeout)
  await driver.click(doneButtonId)
  t.pass('User should be able to tap on `Done` button')

  // Sometimes on Travis we have a problem with the network connection,
  // it is related to problems with current container or slow android emulator
  if (platform('android')) {
    try {
      await driver.waitForVisible(tokenId, 180000)
    } catch (error) {
      try {
        t.pass('Token does not exist, try click done button again')
        await driver.waitForEnabled(doneButtonId, 50000)
        await driver.click(doneButtonId)
      } catch (error) { // eslint-disable-line no-shadow, no-empty
        t.pass('Done button does not exist, wait for token')
      }
    }
  }

  await driver.waitForVisible(tokenId, 180000)
  t.pass('User should see token')
})
