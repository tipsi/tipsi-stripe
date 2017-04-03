import test from 'tape-async'
import helper from 'tipsi-appium-helper'

const { driver, select, platform, idFromAccessId, idFromResourceId } = helper

test('Test if user can use Card Form', async (t) => {
  const cardFormTabId = idFromAccessId('Card Form')
  const cardFromButton = idFromAccessId('cardFormButton')
  const numberInputId = select({
    ios: idFromAccessId('card number'),
    android: idFromResourceId('com.example:id/cc_card'),
  })
  const doneButtonId = select({
    ios: idFromAccessId('Done'),
    android: idFromResourceId('android:id/button1'),
  })
  const tokenId = idFromAccessId('cardFormToken')

  try {
    await driver.waitForVisible(cardFormTabId, 70000)
    await driver.click(cardFormTabId)

    await driver.waitForVisible(cardFromButton, 15000)

    t.pass('User should see `Enter you card and pay` button')

    await driver.click(cardFromButton)

    t.pass('User should be able to tap on `Enter you card and pay` button')

    await driver.waitForVisible(numberInputId, 10000)
    await driver.click(numberInputId)

    await driver.keys('4242424242424242 1234 123')

    t.pass('User should be able write card data')

    if (platform('android')) {
      await helper.hideKeyboard()
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
  } catch (error) {
    await helper.screenshot()
    await helper.source()

    if (platform('android')) {
      await driver.back()
    }

    throw error
  }
})
