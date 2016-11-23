import test from 'tape-async'
import helper from './utils/helper'

       const { driver, idFromXPath, idFromAccessId, idFromResourceId } = helper

       test('03 Test Card Text Filed', async(t) => {

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
//
               t.equal(await driver.getText(valid), 'Valid: true', 'Field should be valid')
               t.equal(await driver.getText(number), 'Number: 4242 4242 4242 4242', 'Number should be 4242 4242 4242 4242')
               t.equal(await driver.getText(expMonth), 'Month: 12', 'Month should be 12')
               t.equal(await driver.getText(expYear), 'Year: 34', 'Year should be 34')
               t.equal(await driver.getText(cvc), 'CVC: 123', 'CVC should be 123')

             } catch (error) {
               await helper.screenshot()
               await helper.source()

               throw error
             }
       })
