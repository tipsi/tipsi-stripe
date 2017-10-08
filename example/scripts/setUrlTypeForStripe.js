#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const exampleRoot = process.cwd()
const infoPlistPath = path.join(exampleRoot, 'ios', 'example', 'Info.plist')

const commands = [
  'Add :CFBundleURLTypes array',
  'Add :CFBundleURLTypes:0 dict',
  'Add :CFBundleURLTypes:0:CFBundleTypeRole string Editor',
  'Add :CFBundleURLTypes:0:CFBundleURLName string example',
  'Add :CFBundleURLTypes:0:CFBundleURLSchemes array',
  'Add :CFBundleURLTypes:0:CFBundleURLSchemes:0 string example',
]

commands.forEach(command => (
  execSync(`/usr/libexec/PlistBuddy -x -c "${command}" "${infoPlistPath}"`)
))
