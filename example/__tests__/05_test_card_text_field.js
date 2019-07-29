import helper from 'tipsi-appium-helper'
import test from './utils/tape'
import openTestSuite from './common/openTestSuite'

const { driver, select, idFromAccessId, idFromResourceId } = helper
const timeout = 60000

test('Test if user can use PaymentCardTextField component', async (t) => {
  const cardTextFieldId = idFromAccessId('cardTextField')

  const placeholderId = select({
    ios: idFromAccessId('card number'),
    android: idFromResourceId('com.example:id/cc_card'),
  })

  const inputExpData = select({
    ios: idFromAccessId('expiration date'),
    android: idFromResourceId('com.example:id/cc_exp'),
  })

  const inputCVC = select({
    ios: idFromAccessId('CVC'),
    android: idFromResourceId('com.example:id/cc_ccv'),
  })

  const cardPramIds = {
    valid: idFromAccessId('paramValid'),
    number: idFromAccessId('paramNumber'),
    expMonth: idFromAccessId('paramExpMonth'),
    expYear: idFromAccessId('paramExpYear'),
    cvc: idFromAccessId('paramCVC'),
  }

  await openTestSuite('Card Text Field')

  let elem = await driver.$(cardTextFieldId)
  await elem.waitForDisplayed(timeout)
  t.pass('User should see `PaymentCardTextField` component')

  /*
    Custom Placeholders:

    numberPlaceholder="XXXX XXXX XXXX XXXX"
    expirationPlaceholder="MM/YY"
    cvcPlaceholder="123"
  */
  elem = await driver.$(placeholderId)
  const placeholder = await elem.getText()
  t.equal(placeholder, 'XXXX XXXX XXXX XXXX', 'Custom placeholder as expected')


  elem = await driver.$(placeholderId)
  await elem.waitForDisplayed(timeout)
  await elem.click()
  t.pass('User should be able focus on `PaymentCardTextField` component')

  // Set card credentials
  await elem.setValue("4242424242424242")

  elem = await driver.$(inputExpData)
  await elem.waitForDisplayed(timeout)
  await elem.click()
  await elem.setValue("12/34")

  elem = await driver.$(inputCVC)
  await elem.waitForDisplayed(timeout)
  await elem.click()
  await elem.setValue("123")

  // Wait for expiration date and cvc
  t.pass('User should be able write card data on `PaymentCardTextField` component')


  t.equal(
    await (await driver.$(cardPramIds.number)).getText(),
    'Number: 4242424242424242',
    'Number should be 4242424242424242'
  )
  t.equal(await (await driver.$(cardPramIds.expMonth)).getText(), 'Month: 12', 'Month should be 12')
  t.equal(await (await driver.$(cardPramIds.expYear)).getText(), 'Year: 34', 'Year should be 34')
  t.equal(await (await driver.$(cardPramIds.cvc)).getText(), 'CVC: 123', 'CVC should be 123')
  t.equal(await (await driver.$(cardPramIds.valid)).getText(), 'Valid: true', 'Field should be valid')
})
