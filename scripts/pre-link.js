const cp = require('child_process')

console.log('Preparing to link tipsi-stripe for iOS')
console.log('Checking CocoaPods...')

try {
  cp.execSync('which pod', { encoding: 'utf-8' })
  console.log('CocoaPods already installed')
} catch (e) {
  console.log('Installing CocoaPods...')
  cp.execSync('gem install cocoapods', { stdio: 'inherit' })
}
