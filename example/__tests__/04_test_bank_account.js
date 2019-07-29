import helper from 'tipsi-appium-helper'
import test from './utils/tape'
import openTestSuite from './common/openTestSuite'

const { driver, idFromAccessId } = helper

test('Test if user can use Bank Account', async (t) => {
  const timeout = 120000

  const accountFormButtonId = idFromAccessId('customAccountButton')
  const accountFormErrorButtonId = idFromAccessId('customAccountErrorButton')
  const tokenId = idFromAccessId('customAccountToken')
  const errorMessageId = idFromAccessId('customAccountTokenError')

  await openTestSuite('Custom Bank')

  let elem = await driver.$(accountFormButtonId)
  await elem.waitForDisplayed(timeout)
  t.pass('User should see `Get bank account`s token with custom params` button')


  await elem.click()
  t.pass('User should be able to tap on `Pay with custom params` button')

  elem = await driver.$(tokenId)
  await elem.waitForDisplayed(timeout)
  t.pass('User should see token')

  elem = await driver.$(accountFormErrorButtonId)
  await elem.waitForDisplayed(timeout)
  await elem.click()
  t.pass('User should be able to tap on `Pay with custom params - Error` button')

  elem = await driver.$(errorMessageId)
  await elem.waitForDisplayed(timeout)
  t.pass('User should see error message')
})
