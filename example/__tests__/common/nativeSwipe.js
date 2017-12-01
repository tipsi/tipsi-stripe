import { exec } from 'child_process'

export default function nativeSwipe(x1, y1, x2, y2) {
  return new Promise((resolve, reject) => (
    exec(`adb shell input touchscreen swipe ${x1} ${y1} ${x2} ${y2}`, (error, stdout, stderr) => (
      error ? reject(error) : resolve(stdout)
    ))
  ))
}
