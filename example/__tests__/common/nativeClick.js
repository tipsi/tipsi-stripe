import { execSync } from 'child_process'

export default function nativeClick(x, y) {
  execSync(`adb shell input tap ${x} ${y}`)
}
