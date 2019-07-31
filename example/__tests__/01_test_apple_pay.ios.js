import helper from 'tipsi-appium-helper'
import test from './utils/tape'
import openTestSuite from './common/openTestSuite'

const { driver, idFromAccessId } = helper

test('Test if user can use Apple Pay', async (t) => {
  const applePayButtonId = idFromAccessId('applePayButton')
  const applePaySwitchId = idFromAccessId('applePaySwitch')
  const payWithPasscodeButtonId = idFromAccessId('Pay with Passcode')
  const statusId = idFromAccessId('applePayStatus')
  const tokenId = idFromAccessId('applePayToken')
  const deviceSupportsApplePayStatusId = idFromAccessId('deviceSupportsApplePayStatus')
  const setupApplePayButtonId = idFromAccessId('setupApplePayButton')

  await openTestSuite('Pay')

  let elem = await driver.$(applePayButtonId)
  await elem.waitForDisplayed(30000)
  t.pass('User should see `Pay with Pay` button')

  await elem.click()
  t.pass('User should be able to tap on `Pay with Pay` button')

  let elem = await driver.$(payWithPasscodeButtonId)
  await elem.waitForDisplayed(30000)
  t.pass('User should see Pay form')

  await elem.click()
  t.pass('User should accept Pay payment')

  elem = await driver.$(tokenId)
  await elem.waitForDisplayed(60000)
  t.pass('User should see token')

  elem = await driver.$(statusId)
  t.equal(
    elem.getText(),
    'Apple Pay payment completed',
    'Apple Pay payment should be completed'
  )

  elem = await driver.$(applePaySwitchId)
  await elem.click()
  t.pass('User should be able to tap on `Complete/Cancel` switch')

  elem = await driver.$(applePayButtonId)
  await elem.click()
  t.pass('User should be able to tap on `Pay with Pay` button')

  elem = await driver.$(payWithPasscodeButtonId)
  await elem.waitForDisplayed(30000)
  t.pass('User should see Pay form')

  await elem.click()
  t.pass('User should accept Pay payment')

  elem = await driver.$(tokenId)
  await elem.waitForDisplayed(60000)
  t.pass('User should see token')

  elem = await driver.$(statusId)
  t.equal(
    elem.getText(),
    'Apple Pay payment canceled',
    'Apple Pay payment should be canceled'
  )

  elem = await driver.$(deviceSupportsApplePayStatusId)
  t.equal(
    elem.getText(),
    'Device supports Pay',
    'Device should support Pay'
  )

  const networks = [ 'american_express', 'cartes_bancaires', 'china_union_pay', 'discover', 'eftpos', 'electron', 'elo', 'id_credit', 'interac', 'jcb', 'mada', 'maestro', 'master_card', 'private_label', 'quic_pay', 'suica', 'visa', 'vpay' ];

  for (const network of networks) {
    elem = await driver.$(idFromAccessId(network))
    const text = elem.getText()
    t.equal(text, `${network} is available`, `${network} should be available`)
  }

  elem = await driver.$(idFromAccessId("FAKE_BANK"))
  t.equal(elem.getText(), `FAKE_BANK is not available`, `FAKE_BANK should not be available`)

  elem = await driver.$(setupApplePayButtonId)
  await elem.waitForDisplayed(30000)
  t.pass('User should see `Setup Pay` button')

  await elem.click()
  t.pass('User should be able to tap on `Setup Pay` button')

  elem = await driver.$(setupApplePayButtonId)
  await elem.waitForDisplayed(30000)
  t.pass('User should still see `Setup Pay` button')
})
