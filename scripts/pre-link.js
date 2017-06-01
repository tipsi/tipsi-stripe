const os = require('os')
const cp = require('child_process')

if (os.type() !== 'Darwin') {
  console.log('Skip linking tipsi-stripe for iOS')
  return
}

console.log('Preparing to link tipsi-stripe for iOS')
console.log('Checking CocoaPods...')

try {
  cp.execSync('which pod')
  console.log('CocoaPods already installed')
} catch (e) {
  console.log('Installing CocoaPods...')
  cp.execSync('gem install cocoapods', { stdio: 'inherit' })
}
