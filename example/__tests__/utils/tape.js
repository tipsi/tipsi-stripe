import test from 'tape-async'
import helper from 'tipsi-appium-helper'

export default function tape(name, callback) {
  return test(name, async (t) => {
    try {
      await callback(t)
    } catch (error) {
      await helper.source()
      await helper.screenshot()

      throw error
    }
  })
}
