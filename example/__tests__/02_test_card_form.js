import helper from 'tipsi-appium-helper'
import test from './utils/tape'
import openTestSuite from './common/openTestSuite'

const { driver, select, platform, idFromAccessId, idFromResourceId } = helper

test('Test if user can use Card Form', async (t) => {
  const cardFormButton = idFromAccessId('cardFormButton')
  const numberInputId = select({
    ios: idFromAccessId('card number'),
    android: idFromResourceId('com.example:id/cc_card'),
  })
  const doneButtonId = select({
    ios: idFromAccessId('Done'),
    android: idFromResourceId('android:id/button1'),
  })
  const nextButtonId = idFromAccessId('Next')
  const tokenId = idFromAccessId('cardFormToken')

  await openTestSuite('Card Form')

  await driver.waitForVisible(cardFormButton, 15000)
  t.pass('User should see `Enter you card and pay` button')

  await driver.click(cardFormButton)
  t.pass('User should be able to tap on `Enter you card and pay` button')

  await driver.waitForVisible(numberInputId, 10000)
  await driver.click(numberInputId)
  await driver.setValue(numberInputId, '42424242424242421234123')
  t.pass('User should be able write card data')

  // Iterate over billing address fields (iOS only)
  // Verifies that all fields are filled
  if (platform('ios')) {
    for (const index of new Array(7)) { // eslint-disable-line no-unused-vars
      await driver.waitForVisible(nextButtonId, 10000)
      await driver.click(nextButtonId)
    }
  }

  await driver.waitForEnabled(doneButtonId, 20000)
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
