import test from 'tape-async'
import helper from './utils/helper'

const { driver, idFromXPath, idFromAccessId } = helper

test('Test if user can use Custom Card params', async (t) => {
  const cardFormTabId = idFromXPath(`
    //XCUIElementTypeApplication/XCUIElementTypeWindow/
    XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/
    XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther[2]/
    XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther[2]/
    XCUIElementTypeScrollView/XCUIElementTypeOther/XCUIElementTypeOther[3]
  `)
  const cardFormButtonId = idFromAccessId('customCardButton')
  const tokenId = idFromXPath(`
    //XCUIElementTypeApplication/XCUIElementTypeWindow/
    XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/
    XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther[2]/
    XCUIElementTypeOther/XCUIElementTypeOther[2]/XCUIElementTypeOther/
    XCUIElementTypeOther[3]/XCUIElementTypeOther/XCUIElementTypeOther[3]/
    XCUIElementTypeStaticText
  `)

  try {
    await driver.waitForVisible(cardFormTabId, 60000)

    await driver.click(cardFormTabId)

    await driver.waitForVisible(cardFormButtonId, 5000)

    t.pass('User should see `Pay with custom params` button')

    await driver.click(cardFormButtonId)

    t.pass('User should be able to tap on `Pay with custom params` button')

    await driver.waitForVisible(tokenId, 20000)

    t.pass('User should see token')
  } catch (error) {
    await helper.screenshot()
    await helper.source()

    throw error
  }
})
