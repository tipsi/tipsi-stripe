import test from 'tape-async'
import helper from './utils/helper'

const { driver, idFromAccessId, idFromResourceId } = helper

test('03 Test Card Form', async(t) => {
  try {
    const tabCardForm = idFromAccessId('headerTab_1')

    await driver.waitForVisible(tabCardForm, 70000)

    await driver.click(tabCardForm)

    t.pass('test for tabCardForm')

    const cardFromButton = idFromAccessId('cardFormButton')

    await driver.waitForVisible(cardFromButton, 10000)

    await driver.click(cardFromButton)

    t.pass('test for cardFromButton')


    const cardNumberEdit = idFromResourceId('com.example:id/cc_card')

    await driver.waitForVisible(cardNumberEdit, 10000)

    await driver.setValue(cardNumberEdit, '4242424242424242218123')

    t.pass('test for cardDataEdit')


  //  const expEdit = idFromResourceId('com.example:id/cc_exp')
//
  //  await driver.waitForVisible(expEdit, 10000)
//
  //  await driver.setValue(expEdit, '222')
//
  //  t.pass('test for expEdit')
//
//
  //  const ccvEdit = idFromResourceId('com.example:id/cc_ccv')
//
  //  await driver.waitForVisible(ccvEdit, 10000)
//
  //  await driver.setValue(ccvEdit, '123')
//
  //  await driver.hideDeviceKeyboard()
//
  //  t.pass('test for ccvEdit')

    const doneButton = idFromResourceId('android:id/button1')
    await driver.waitForVisible(doneButton, 20000)

    await driver.click(doneButton)

    t.pass('test for doneButton')

    try {
      const tokenId = idFromAccessId('cardFormToken')

      await driver.waitForVisible(tokenId, 180000)

      t.pass('test for tokenId')
    } catch (error) {
      await helper.screenshot()
      await helper.source()

      await driver.back()

      t.fail('test for tokenId no visible. Call driver.back()')
    }
  } catch (error) {
    await helper.screenshot()
    await helper.source()

    throw error
  }
})
