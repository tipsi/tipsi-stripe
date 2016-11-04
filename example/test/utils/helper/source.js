export default async function () {
  const source = await this.driver.getSource()
  /* eslint-disable no-console */
  console.log('---------------------------------------------------')
  console.log('SOURCE START')
  console.log()
  console.log(source)
  console.log()
  console.log('SOURCE END')
  console.log('---------------------------------------------------')
  /* eslint-enable no-console */
  return source
}
