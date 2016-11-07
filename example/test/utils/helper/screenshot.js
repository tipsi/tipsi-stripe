import imgur from 'imgur'

export default async function () {
  imgur.setClientId(this.config.imgur)

  const screenshot = await this.driver.saveScreenshot()

  return imgur.uploadBase64(screenshot.toString('base64'))
    /* eslint-disable no-console */
    .then((json) => {
      console.log('---------------------------------------------------')
      console.log('SCREEENSHOT URL:', json.data.link)
      console.log('---------------------------------------------------')
      return json.data
    })
    .catch((error) => {
      console.log('---------------------------------------------------')
      console.error('Failed to save screenshot:', error.message)
      console.log('---------------------------------------------------')
    })
    /* eslint-enable no-console */
}
