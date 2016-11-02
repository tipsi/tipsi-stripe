import path from 'path'
import glob from 'glob'
import tape from 'tape'
import tapDiff from 'tap-diff'

/* eslint global-require: 0 import/no-dynamic-require:0 */
export default function runTapeTests(...args) {
  return new Promise((resolve) => {
      // Specify tap-diff reporter
    tape.createStream()
      .pipe(tapDiff())
      .pipe(process.stdout)

    const cwd = process.cwd()
    args.forEach((arg) => {
      const files = glob.sync(arg)
      files.forEach(
        file => require(path.resolve(cwd, file))
      )
    })

    tape.onFinish(resolve)
  })
}
