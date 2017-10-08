import helper from 'tipsi-appium-helper'

const { driver } = helper

export default async function swipeUp(selector, yoffset = 0) {
  const element = await driver.element(selector)
  await driver.touchPerform([{
    action: 'press',
    options: { element: element.value.ELEMENT },
  }, {
    action: 'moveTo',
    options: { x: 0, y: yoffset * -1 },
  }, {
    action: 'release',
  }])
}
