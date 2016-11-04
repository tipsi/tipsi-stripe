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
    .catch((err) => {
      console.error('Failed to load screenshot:', err.message)
    })
    /* eslint-enable no-console */
}
