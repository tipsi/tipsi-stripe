import test from 'tape-async'
import helper from './utils/helper'

const { driver, idFromAccessId, idFromResourceId } = helper

test('02 Test Card Form', async(t) => {
  try {
    const tabCardForm = idFromAccessId('headerTab_1')

    await driver.waitForVisible(tabCardForm, 70000)

    await driver.click(tabCardForm)

    t.pass('test for tabCardForm')

    const cardFromButton = idFromAccessId('cardFormButton')

    await driver.waitForVisible(cardFromButton, 10000)

    await driver.click(cardFromButton)

    t.pass('test for cardFromButton')

    const cardNumberEdit = idFromResourceId('com.example:id/cc_card')

    await driver.waitForVisible(cardNumberEdit, 10000)

    await driver.click(cardNumberEdit)

    await driver.keys('4242424242424242 1234 123')

    t.pass('test for cardDataEdit')

    const doneButton = idFromResourceId('android:id/button1')
    await driver.waitForEnabled(doneButton, 20000)

    await driver.click(doneButton)

    t.pass('test for doneButton')

    try {
      const progress = idFromResourceId('com.example:id/buttonProgress')
      await driver.waitForVisible(progress, 15000)
      t.pass('progress is visible')
    } catch (error) {
      // Fix Travis temporary issue
      try {
        t.pass('progress no visible')
        await driver.click(doneButton)
        t.pass('test for second click doneButton')
      } catch (error) {} // eslint-disable-line no-shadow, no-empty
    }

    try {
      const tokenId = idFromAccessId('cardFormToken')

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
