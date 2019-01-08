const path = require('path')

module.exports = {
  getProjectRoots() {
    return [
      path.resolve(__dirname),
    ]
  },
}
