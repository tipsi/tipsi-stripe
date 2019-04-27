import helper from 'tipsi-appium-helper'
import test from './utils/tape'
import openTestSuite from './common/openTestSuite'

const { driver, select, platform, idFromAccessId, idFromResourceId, idFromText } = helper

test('Test if user can use Payment Methods Form', async (t) => {
  const paymentMethodsFormButton = idFromAccessId('paymentMethodsFormButton')
  const addNewCard = select({
    ios: idFromAccessId('Add New Card…'),
    android: idFromText('Add new card…'),
  })
  
  const numberInputId = select({
    ios: idFromAccessId('card number'),
    android: idFromResourceId('com.example:id/et_add_source_card_number_ml'),
  })
  const doneButtonId = select({
    ios: idFromAccessId('Done'),
    android: idFromResourceId('com.example:id/action_save'),
  })
  const resultId = idFromAccessId('paymentMethodsFormPaymentMethod')

  await openTestSuite('Payment Methods')

  await driver.waitForVisible(paymentMethodsFormButton, 15000)
  t.pass('User should see `Select a payment method and pay` button')

  // no point in continuing if backend url was not configured
  if ('<BACKEND_URL>' == '')
    return;

  await driver.click(paymentMethodsFormButton)
  t.pass('User should be able to tap on `Select a payment method and pay` button')

  await driver.waitForVisible(addNewCard, 30000)
  t.pass('User should see `Add new card` button')

  await driver.click(addNewCard)
  t.pass('User should be able to tap on  `Add new card` button')

  await driver.waitForVisible(numberInputId, 10000)
  await driver.click(numberInputId)
  await driver.setValue(numberInputId, '42424242424242421234123')
  t.pass('User should be able write card data')

  await driver.waitForEnabled(doneButtonId, 20000)
  await driver.click(doneButtonId)
  t.pass('User should be able to tap on `Done` button')

  if (platform('android')) {
    // for android the experiance is a bit different, there's another
    // done to click
    await driver.waitForEnabled(doneButtonId, 20000)
    await driver.click(doneButtonId)
    t.pass('User should be able to tap on payment methods `Done` button')
  }

  // Sometimes on Travis we have a problem with the network connection,
  // it is related to problems with current container or slow android emulator
  if (platform('android')) {
    try {
      await driver.waitForVisible(resultId, 180000)
    } catch (error) {
      try {
        t.pass('result does not exist, try click done button again')
        await driver.waitForEnabled(doneButtonId, 50000)
        await driver.click(doneButtonId)
      } catch (error) { // eslint-disable-line no-shadow, no-empty
        t.pass('Done button does not exist, wait for token')
      }
    }
  }

  await driver.waitForVisible(resultId, 180000)
  t.pass('User should see payment result type')
})
