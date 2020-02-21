import helper from 'tipsi-appium-helper'
import test from './utils/tape'
import openTestSuite from './common/openTestSuite'

const { driver, idFromAccessId } = helper

test('Test if user can use Custom Card params', async (t) => {

  const cardFormButtonId = idFromAccessId('customCardButton')
  const tokenId = idFromAccessId('customCardToken')
  const cardFormErrorButtonId = idFromAccessId('customCardErrorButton')
  const tokenErrorId = idFromAccessId('customCardTokenError')

  await openTestSuite('Custom Card')

  let elem = await driver.$(cardFormButtonId)
  await elem.waitForDisplayed(50000)
  t.pass('User should see `Pay with custom params` button')

  await elem.click()
  t.pass('User should be able to tap on `Pay with custom params` button')

  elem = await driver.$(tokenId)
  await elem.waitForDisplayed(50000)
  t.pass('User should see token')

  elem = await driver.$(cardFormErrorButtonId)
  await elem.waitForDisplayed(50000)
  t.pass('User should be able to see `Pay with custom params - error` button')

  await elem.click()
  t.pass('User should be able to tap on `Pay with custom params - error` button')

  elem = await driver.$(tokenErrorId)
  await elem.waitForDisplayed(500000)
  t.pass('User should see error message')
})
