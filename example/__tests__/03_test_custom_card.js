import helper from 'tipsi-appium-helper'
import test from './utils/tape'
import openTestSuite from './common/openTestSuite'

const { driver, idFromAccessId } = helper

test('Test if user can use Custom Card params', async (t) => {
  const cardFormButtonId = idFromAccessId('customCardButton')
  const tokenId = idFromAccessId('customCardToken')

  await openTestSuite('Custom Card')

  await driver.waitForVisible(cardFormButtonId, 15000)
  t.pass('User should see `Pay with custom params` button')

  await driver.click(cardFormButtonId)
  t.pass('User should be able to tap on `Pay with custom params` button')

  await driver.waitForVisible(tokenId, 500000)
  t.pass('User should see token')
})
