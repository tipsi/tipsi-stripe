import test from 'tape-async'
import helper from './utils/helper'

const { driver, idFromAccessId } = helper

test('04 Test Card Text Filed', async(t) => {
  try {
    const tabCardForm = idFromAccessId('headerTab_3')

    await driver.waitForVisible(tabCardForm, 70000)

    await driver.click(tabCardForm)

    t.pass('test for tabCardForm')

    const cardTextFieldId = idFromAccessId('cardTextField')

    await driver.waitForVisible(cardTextFieldId, 5000)

    t.pass('User should see `PaymentCardTextField` component')

    await driver.click(cardTextFieldId)

    t.pass('User should be able focus on `PaymentCardTextField` component')

    await driver.keys('4242424242424242 1234 123')

    t.pass('User should be able write card data on `PaymentCardTextField` component')

    const fieldsId = idFromAccessId('fieldsId')

    await driver.waitForVisible(fieldsId, 15000)

    t.pass('User should see view with id fieldsId')

    const valid = idFromAccessId('valid')

    await driver.waitForVisible(valid, 15000)

    const number = idFromAccessId('number')

    const expMonth = idFromAccessId('expMonth')

    const expYear = idFromAccessId('expYear')

    const cvc = idFromAccessId('cvc')

    const resultValid = await driver.getText(valid)
    t.equal(resultValid, 'Valid: true', 'Field should be valid')

    const resultNumber = await driver.getText(number)
    t.equal(resultNumber, 'Number: 4242 4242 4242 4242', 'Number should be 4242 4242 4242 4242')

    const resultExpMonth = await driver.getText(expMonth)
    t.equal(resultExpMonth, 'Month: 12', 'Month should be 12')

    const resultExpYear = await driver.getText(expYear)
    t.equal(resultExpYear, 'Year: 34', 'Year should be 34')

    const resultCvc = await driver.getText(cvc)
    t.equal(resultCvc, 'CVC: 123', 'CVC should be 123')

    // Temp
    await helper.screenshot()
    await helper.source()
  } catch (error) {
    await helper.screenshot()
    await helper.source()

    throw error
  }
})
