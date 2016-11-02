export default async function () {
  if (this.driver) {
    await this.driver.end()
    this.driver = null
    this.config = {}
  }
}
