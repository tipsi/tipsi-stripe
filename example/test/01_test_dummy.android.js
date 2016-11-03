import test from 'tape-async'
import helper from './utils/helper'

const { driver, idFromXPath } = helper

test('Test if user can see welcome message', async (t) => {
  const welcomeMessageId = idFromXPath(`
    //android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/
    android.widget.FrameLayout[1]/android.widget.Spinner[1]
  `)

  console.log('SOURCE1:', await driver.getSource())

  await driver.waitForVisible(welcomeMessageId, 240000)

  t.pass('User should see welcome message')

  console.log('SOURCE2:', await driver.getSource())
})
