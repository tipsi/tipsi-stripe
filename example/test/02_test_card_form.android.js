import test from 'tape-async'
import helper from './utils/helper'

const { driver, idFromAccessId, idFromResourceId } = helper

test('Test if user can use Card Form', async(t) => {
  const cardFormTabId = idFromAccessId('headerTab_1')
  const cardFromButton = idFromAccessId('cardFormButton')
  const numberInputId = idFromResourceId('com.example:id/cc_card')
  const doneButtonId = idFromResourceId('android:id/button1')
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

    t.pass('test for cardDataEdit')

    await driver.waitForEnabled(doneButtonId, 20000)
    await driver.click(doneButtonId)

    t.pass('User should be able to tap on `Done` button')

    try {
      const progress = idFromResourceId('com.example:id/buttonProgress')
      await driver.waitForVisible(progress, 15000)
      t.pass('progress is visible')
    } catch (error) {
      // Fix Travis temporary issue
      try {
        t.pass('progress no visible')
        await driver.click(doneButtonId)
        t.pass('test for second click doneButton')
      } catch (error) {} // eslint-disable-line no-shadow, no-empty
    }

    try {
      await driver.waitForVisible(tokenId, 180000)

      t.pass('test for tokenId')
    } catch (error) {
      await helper.screenshot()
      await helper.source()

      await driver.back()

      t.fail('test for tokenId no visible. Call driver.back()')
    }
  } catch (error) {
    await helper.screenshot()
    await helper.source()

    throw error
  }
})
