import { execSync } from 'child_process'

export default function nativeSwipe() {
  execSync('adb shell input touchscreen swipe 530 1420 530 1120')
}
