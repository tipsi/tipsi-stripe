const os = require('os')
const cp = require('child_process')
const path = require('path')

if (os.type() === 'Darwin') {
  cp.execSync(`ruby ${path.join(__dirname, 'post-link-ios.rb')}`, { stdio: 'inherit' })
}

cp.execSync(`node ${path.join(__dirname, 'post-link-android.js')}`, { stdio: 'inherit' })
