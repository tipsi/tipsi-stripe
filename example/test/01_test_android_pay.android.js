import test from 'tape-async'
import helper from './utils/helper'

const { driver, /* idFromXPath, */ idFromAccessId } = helper

test('Test if user can use Android Pay', async(t) => {
  try {
    const tabAndroidPay = idFromAccessId('headerTab_0')

    await driver.waitForVisible(tabAndroidPay, 70000)

    await driver.click(tabAndroidPay)

    t.pass('test for tabAndroidPay')

    const androidPayButton = idFromAccessId('androidPayButton')

    await driver.waitForVisible(androidPayButton, 10000)

    // await driver.click(androidPayButton)

    t.pass('test for androidPayButton')

    // const androidPayDialog = idFromXPath(`//
    //   android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/
    //   android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/
    //   android.widget.LinearLayout[1]/android.widget.LinearLayout[1]/
    //   android.widget.LinearLayout[1]
    // `)

    // await driver.waitForVisible(androidPayDialog, 20000)

    // t.pass('test for ' + 'androidPayDialog')
  } catch (error) {
    await helper.screenshot()
    await helper.source()

    throw error
  }
})
