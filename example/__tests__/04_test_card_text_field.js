import test from 'tape-async'
import helper from 'tipsi-appium-helper'

const { driver, select, idFromXPath, idFromAccessId } = helper

test('Test if user can use PaymentCardTextField component', async(t) => {
  const cardTextFieldTabId = select({
    ios: idFromXPath('//*/XCUIElementTypeScrollView/XCUIElementTypeOther/XCUIElementTypeOther[4]'),
    android: idFromAccessId('headerTab_3'),
  })
  const cardTextFieldId = idFromAccessId('cardTextField')
  const fieldsId = select({
    ios: idFromXPath('//*/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[2]/XCUIElementTypeStaticText'),
    android: idFromAccessId('cardField'),
  })

  try {
    await driver.waitForVisible(cardTextFieldTabId, 70000)
    await driver.click(cardTextFieldTabId)

    await driver.waitForVisible(cardTextFieldId, 5000)

    t.pass('User should see `PaymentCardTextField` component')

    await driver.click(cardTextFieldId)

    t.pass('User should be able focus on `PaymentCardTextField` component')

    await driver.keys('4242424242424242 1234 123')

    t.pass('User should be able write card data on `PaymentCardTextField` component')

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
