import test from 'tape-async'
import helper from './utils/helper'

const { driver, select, platform, idFromXPath, idFromAccessId, idFromResourceId } = helper

test('Test if user can use Card Form', async(t) => {
  const cardFormTabId = select({
    ios: idFromXPath('//*/XCUIElementTypeScrollView/XCUIElementTypeOther/XCUIElementTypeOther[2]'),
    android: idFromAccessId('headerTab_1'),
  })
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

    await driver.waitForVisible(cardFromButton, 10000)

    t.pass('User should see `Enter you card and pay` button')

    await driver.click(cardFromButton)

    t.pass('User should be able to tap on `Enter you card and pay` button')

    await driver.waitForVisible(numberInputId, 10000)
    await driver.click(numberInputId)

    await driver.keys('4242424242424242 1234 123')

    t.pass('User should be able write card data')

    await driver.waitForEnabled(doneButtonId, 20000)
    await driver.click(doneButtonId)

    t.pass('User should be able to tap on `Done` button')

    if (platform('android')) {
      try {
        const progress = idFromResourceId('com.example:id/buttonProgress')
        await driver.waitForVisible(progress, 15000)
        t.pass('Progress exist, wait for token')
      } catch (error) {
        // Fix Travis temporary issue
        try {
          t.pass('Progress does not exist, try click again')
          await driver.click(doneButtonId)
        } catch (error) {} // eslint-disable-line no-shadow, no-empty
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
