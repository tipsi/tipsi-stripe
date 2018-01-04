import { exec } from 'child_process'

export default function nativeClick(x, y) {
  return new Promise((resolve, reject) => (
    exec(`adb shell input tap ${x} ${y}`, (error, stdout, stderr) => (
      error ? reject(error) : resolve(stdout)
    ))
  ))
}
