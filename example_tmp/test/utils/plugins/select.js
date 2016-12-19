export default function select(selector) {
  return selector[this.config.platformName]
}
