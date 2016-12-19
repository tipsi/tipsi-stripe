import pastebin from 'better-pastebin'

export default async function () {
  pastebin.setDevKey(this.config.pastebin)

  const source = await this.driver.getSource()

  return new Promise((resolve) => {
    pastebin.create({
      contents: source,
      privacy: 1,
      format: 'xml',
      name: `Appium source ${new Date()}`,
    }, (success, data) => {
      /* eslint-disable no-console */
      if (success) {
        console.log('---------------------------------------------------')
        console.log('SOURCE URL:', data)
        console.log('---------------------------------------------------')
        resolve(data)
      } else {
        console.log('---------------------------------------------------')
        console.log('Failed to save source:', data.message)
        console.log('---------------------------------------------------')
        resolve(null)
      }
      /* eslint-enable no-console */
    })
  })
}
