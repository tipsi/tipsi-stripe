import test from 'tape-async'
import helper from './utils/helper'

const { driver, idFromXPath, idFromAccessId } = helper

test('Test if user can use Card Form', async (t) => {
  const cardFormTabId = idFromXPath('//*/XCUIElementTypeScrollView/XCUIElementTypeOther/XCUIElementTypeOther[2]')
  const cardFormButtonId = idFromAccessId('cardFormButton')
  const numberInputId = idFromAccessId('card number')
  const doneButtonId = idFromAccessId('Done')
  const tokenId = idFromAccessId('cardFormToken')

  try {
    await driver.waitForVisible(cardFormTabId, 60000)
    await driver.click(cardFormTabId)

    await driver.waitForVisible(cardFormButtonId, 5000)

    t.pass('User should see `Enter you card and pay` button')

    await driver.click(cardFormButtonId)

    t.pass('User should be able to tap on `Enter you card and pay` button')

    await driver.waitForVisible(numberInputId, 10000)
    await driver.click(numberInputId)

    await driver.keys('4242424242424242 1234 123')

    await driver.waitForVisible(doneButtonId, 10000)
    await driver.click(doneButtonId)

    t.pass('User should be able to tap on `Done` button')

    await driver.waitForVisible(tokenId, 20000)

    t.pass('User should see token')
  } catch (error) {
    await helper.screenshot()
    await helper.source()

    throw error
  }
})
