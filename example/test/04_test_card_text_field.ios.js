import test from 'tape-async'
import helper from './utils/helper'

const { driver, idFromXPath, idFromAccessId } = helper

test('Test if user can use PaymentCardTextField component', async (t) => {
  const cardTextFieldTabId = idFromXPath(`
    //XCUIElementTypeApplication/XCUIElementTypeWindow/
    XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/
    XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther[2]/
    XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther[2]/
    XCUIElementTypeScrollView/XCUIElementTypeOther/XCUIElementTypeOther[4]
  `)
  const cardTextFieldId = idFromAccessId('cardTextField')
  const fieldsId = idFromXPath(`
    //XCUIElementTypeApplication/XCUIElementTypeWindow/
    XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/
    XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther[2]/
    XCUIElementTypeOther/XCUIElementTypeOther[2]/XCUIElementTypeOther/
    XCUIElementTypeOther[4]/XCUIElementTypeOther/XCUIElementTypeOther/
    XCUIElementTypeOther[2]/XCUIElementTypeStaticText
  `)

  try {
    await driver.waitForVisible(cardTextFieldTabId, 60000)

    await driver.click(cardTextFieldTabId)

    await driver.waitForVisible(cardTextFieldId, 5000)

    t.pass('User should see `PaymentCardTextField` component')

    await driver.click(cardTextFieldId)

    t.pass('User should be able focus on `PaymentCardTextField` component')

    await driver.keys('4242424242424242')
    await driver.keys('1234')
    await driver.keys('123')

    const [valid, number, month, year, cvc] = await driver.getText(fieldsId)

    t.equal(valid, 'Valid: true', 'Field should be valid')
    t.equal(number, 'Number: 4242424242424242', 'Number should be 4242424242424242')
    t.equal(month, 'Month: 12', 'Month should be 12')
    t.equal(year, 'Year: 34', 'Year should be 34')
    t.equal(cvc, 'CVC: 123', 'CVC should be 123')
  } catch (error) {
    await helper.screenshot()
    await helper.source()

    throw error
  }
})
