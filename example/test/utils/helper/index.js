import init from './init'
import release from './release'

class Helper {
  driver = null
  config = {}

  init = config => init.call(this, config)

  release = () => release.call(this)

  idFromXPath = xpath => xpath.replace(/\s+/g, '', '')

  idFromResourceId = resourceId => `//*[@resource-id="${resourceId}"]`

  idFromAccessId = accessId => `~${accessId}`

  idFromText = text => `//*[@text="${text}"]`
}

// This is singleton
export default new Helper()
