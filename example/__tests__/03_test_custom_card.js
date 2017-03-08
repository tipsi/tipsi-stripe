import test from 'tape-async'
import helper from 'tipsi-appium-helper'

const { driver, select, idFromXPath, idFromAccessId } = helper

test('Test if user can use Custom Card params', async (t) => {
  const cardFormTabId = select({
    ios: idFromXPath('//XCUIElementTypeScrollView/*/XCUIElementTypeOther[3]'),
    android: idFromAccessId('headerTab_2'),
  })
  const cardFormButtonId = idFromAccessId('customCardButton')
  const tokenId = idFromAccessId('customCardToken')

  try {
    await driver.waitForVisible(cardFormTabId, 70000)
    await driver.click(cardFormTabId)

    await driver.waitForVisible(cardFormButtonId, 15000)

    t.pass('User should see `Pay with custom params` button')

    await driver.click(cardFormButtonId)

    t.pass('User should be able to tap on `Pay with custom params` button')

    await driver.waitForVisible(tokenId, 500000)

    t.pass('User should see token')
  } catch (error) {
    await helper.screenshot()
    await helper.source()

    throw error
  }
})
