#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

const exampleRoot = process.cwd()
const string = '"tipsi-stripe": "file:../'

function replaceConstant(filePath) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return err
    }

    const result = data.replace(string, `${string}${process.env.tarball_name}`)
    return fs.writeFile(filePath, result, 'utf8', error => (
      error && console.error(error) // eslint-disable-line
    ))
  })
}


replaceConstant(path.join(exampleRoot, 'package.json'))
