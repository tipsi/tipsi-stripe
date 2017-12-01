import { exec } from 'child_process'

export default function nativeSwipe() {
  return new Promise((resolve, reject) => (
    exec('adb shell input touchscreen swipe 530 1420 530 1120', (error, stdout, stderr) => (
      error ? reject(error) : resolve(stdout)
    ))
  ))
}
