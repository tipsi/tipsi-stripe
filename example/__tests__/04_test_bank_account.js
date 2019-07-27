import helper from 'tipsi-appium-helper'
import test from './utils/tape'
import openTestSuite from './common/openTestSuite'

const { driver, idFromAccessId } = helper

test('Test if user can use Bank Account', async (t) => {
  const accountFormButtonId = idFromAccessId('customAccountButton')
  const accountFormErrorButtonId = idFromAccessId('customAccountErrorButton')
  const tokenId = idFromAccessId('customAccountToken')
  const errorMessageId = idFromAccessId('customAccountTokenError')

  await openTestSuite('Custom Bank')

  await driver.waitForVisible(accountFormButtonId, 30000)
  t.pass('User should see `Get bank account`s token with custom params` button')

  await driver.click(accountFormButtonId)
  t.pass('User should be able to tap on `Pay with custom params` button')

  await driver.waitForVisible(tokenId, 500000)
  t.pass('User should see token')

  await driver.click(accountFormErrorButtonId)
  t.pass('User should be able to tap on `Pay with custom params - Error` button')

  await driver.waitForVisible(errorMessageId, 500000)
  t.pass('User should see error message')
})
