import helper from 'tipsi-appium-helper'

const { driver } = helper

/**
 * This helper click on `selector` if `waitFor` element is visible.
 * @param  {String}  options.selector               Element that need to be clicked
 * @param  {Number}  options.attempts               How many times to try before fail
 * @param  {Number}  options.timeout                Wait For Visibility timeout
 * @param  {Boolean} options.allowToFailBeforeClick Stop helper after first click fail
 * @param  {String}  options.waitFor                Element that need to be visible
 */
export default async function clickUntilVisible(props) {
  const {
    selector,
    attempts = 4,
    timeout = 10000,
    allowToFailBeforeClick = false,
    waitFor = props.selector,
  } = props

  try {
    await driver.waitForVisible(waitFor, timeout)
    await driver.click(selector)
  } catch (error) {
    if (allowToFailBeforeClick) {
      return
    }

    throw error
  }

  try {
    await driver.waitForVisible(waitFor, timeout, true)
  } catch (error) {
    if (attempts) {
      await clickUntilVisible({ selector, attempts: attempts - 1, timeout, waitFor })
    } else {
      throw error
    }
  }
}
