import test from 'tape-async'
import helper from './utils/helper'

const { driver, idFromXPath, idFromAccessId } = helper

test('Test if user can use Card Form', async (t) => {
  const cardFormTabId = idFromXPath(`
    //XCUIElementTypeApplication/XCUIElementTypeWindow/
    XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/
    XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther[2]/
    XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther[2]/
    XCUIElementTypeScrollView/XCUIElementTypeOther/XCUIElementTypeOther[2]
  `)
  const cardFormButtonId = idFromAccessId('cardFormButton')
  const numberInputId = idFromAccessId('card number')
  const dateInputId = idFromAccessId('expiration date')
  const cvcInputId = idFromAccessId('CVC')
  const doneButtonId = idFromXPath(`
    //XCUIElementTypeApplication/XCUIElementTypeWindow/
    XCUIElementTypeOther/XCUIElementTypeOther/
    XCUIElementTypeNavigationBar/XCUIElementTypeButton[2]
  `)
  const tokenId = idFromXPath(`
    //XCUIElementTypeApplication/XCUIElementTypeWindow/
    XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/
    XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther[2]/
    XCUIElementTypeOther/XCUIElementTypeOther[2]/XCUIElementTypeOther/
    XCUIElementTypeOther[2]/XCUIElementTypeOther/XCUIElementTypeOther[2]/
    XCUIElementTypeStaticText
  `)

  try {
    await driver.waitForVisible(cardFormTabId, 60000)

    await driver.click(cardFormTabId)

    await driver.waitForVisible(cardFormButtonId, 5000)

    t.pass('User should see `Enter you card and pay` button')

    await driver.click(cardFormButtonId)

    t.pass('User should be able to tap on `Enter you card and pay` button')

    await driver.waitForVisible(numberInputId, 10000)
    await driver.click(numberInputId)
    await driver.setValue(numberInputId, '4242424242424242')

    t.pass('User should be able to enter card number')

    await driver.waitForVisible(dateInputId, 10000)
    await driver.click(dateInputId)
    await driver.setValue(dateInputId, '1234')

    t.pass('User should be able to enter expiration date')

    await driver.waitForVisible(cvcInputId, 10000)
    await driver.click(cvcInputId)
    await driver.setValue(cvcInputId, '123')

    t.pass('User should be able to enter CVC code')

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
