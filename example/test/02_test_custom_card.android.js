import test from 'tape-async'
import helper from './utils/helper'

const { driver, idFromAccessId } = helper

test('02 Test Custom Card', async(t) => {
  try {
    const tabCustomCard = idFromAccessId('headerTab_2')

    await driver.waitForVisible(tabCustomCard, 70000)

    await driver.click(tabCustomCard)

    t.pass('test for tabCustomCard')

    const customCardButton = idFromAccessId('customCardButton')

    await driver.waitForVisible(customCardButton, 10000)

    await driver.click(customCardButton)

    t.pass('test for customCardButton')

    const tokenId = idFromAccessId('customCardToken')

    await driver.waitForVisible(tokenId, 500000)

    t.pass('test for tokenId')

    t.pass('test for Successful!')
  } catch (error) {
    await helper.screenshot()
    await helper.source()

    throw error
  }
})
