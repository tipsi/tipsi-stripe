import test from 'tape-async'
import helper from 'tipsi-appium-helper'

const { driver, select, idFromXPath, idFromAccessId, idFromResourceId } = helper

test('Test if user can use PaymentCardTextField component', async (t) => {
  const cardTextFieldTabId = select({
    ios: idFromXPath('//XCUIElementTypeScrollView/*/XCUIElementTypeOther[4]'),
    android: idFromAccessId('headerTab_3'),
  })
  const cardTextFieldId = idFromAccessId('cardTextField')
  const inputNumber = select({
    ios: idFromAccessId('card number'),
    android: idFromResourceId('com.example:id/cc_four_digits'),
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

  try {
    await driver.waitForVisible(cardTextFieldTabId, 70000)
    await driver.click(cardTextFieldTabId)

    await driver.waitForVisible(cardTextFieldId, 5000)

    t.pass('User should see `PaymentCardTextField` component')

    await driver.click(cardTextFieldId)

    t.pass('User should be able focus on `PaymentCardTextField` component')

    await driver.keys('4242424242424242 1234 123')
    await driver.waitForVisible(inputNumber, 5000)
    await driver.waitForVisible(inputExpData, 5000)
    await driver.waitForVisible(inputCVC, 5000)

    t.pass('User should be able write card data on `PaymentCardTextField` component')

    t.equal(await driver.getText(cardPramIds.valid), 'Valid: true', 'Field should be valid')
    t.equal(await driver.getText(cardPramIds.number), 'Number: 4242424242424242', 'Number should be 4242424242424242')
    t.equal(await driver.getText(cardPramIds.expMonth), 'Month: 12', 'Month should be 12')
    t.equal(await driver.getText(cardPramIds.expYear), 'Year: 34', 'Year should be 34')
    t.equal(await driver.getText(cardPramIds.cvc), 'CVC: 123', 'CVC should be 123')
  } catch (error) {
    await helper.screenshot()
    await helper.source()

    throw error
  }
})
