import test from 'tape-async'
import helper from './utils/helper'

const { driver, idFromXPath } = helper

test('Test if user can see welcome message', async (t) => {
  const welcomeMessageId = idFromXPath(`
    //android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/
    android.widget.FrameLayout[1]/android.view.ViewGroup[1]/
    android.widget.TextView[1]
  `)

  console.log('SOURCE:', await driver.getSource())

  await driver.waitForVisible(welcomeMessageId, 240000)

  t.pass('User should see welcome message')

  console.log('SOURCE:', await driver.getSource())
})
