import test from 'tape-async'
import helper from './utils/helper'

const { driver, idFromAccessId } = helper

test('Test if user can see `Pay with Pay` button', async (t) => {
  const applePayButtonId = idFromAccessId('applePayButton')
  // const payWithPasscodeButtonId = idFromAccessId('Pay with Passcode')

  await driver.waitForVisible(applePayButtonId, 60000)

  t.pass('User should see `Pay with Pay` button')

  await driver.click(applePayButtonId)

  t.pass('User should be able to tap on `Pay with Pay` button')

  // await driver.waitForVisible(payWithPasscodeButtonId, 60000)
  //
  // t.pass('User should see Pay form')
  //
  // await driver.click(payWithPasscodeButtonId)
  //
  // t.pass('User should accept Pay payment')
})
