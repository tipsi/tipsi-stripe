#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const xcode = require('xcode')

const moduleDir = path.resolve(__dirname, '..', 'node_modules')
const reactXcodeprojPath = path.join(
  moduleDir,
  'react-native',
  'React',
  'React.xcodeproj',
  'project.pbxproj'
)
/* eslint-disable no-console */
function main() {
  const proj = xcode.project(reactXcodeprojPath)
  proj.parseSync()

  // Clean up -tvOS targets in the React xcodeproj, because React doesn't play nice
  // with Cocoapods until at least React-Native 60
  // References:
  // - https://github.com/facebook/react-native/issues/23935#issuecomment-473918809
  // - https://facebook.github.io/react-native/docs/integration-with-existing-apps
  const deletedTargetUUIDs = []

  const nativeTargetSectionMap = proj.pbxNativeTargetSection()
  Object.keys(nativeTargetSectionMap)
    .map((key) => [key, nativeTargetSectionMap[key]])
    .forEach(([key, value]) => {
      if (typeof value === 'string') {
        if (value.includes('-tvOS')) {
          console.debug('Deleting comment for', value)
          delete nativeTargetSectionMap[key]
        }
      } else if (value.name.includes('-tvOS')) {
        console.debug('Deleting entry for', value.name, key)
        delete nativeTargetSectionMap[key]
        deletedTargetUUIDs.push(value.uuid)
      }
    })

  // Filter the targets out of the project!
  const { firstProject } = proj.getFirstProject()
  firstProject.targets = firstProject.targets.filter((t) => !t.comment.includes('-tvOS'))

  fs.writeFileSync(reactXcodeprojPath, proj.writeSync())
}

main()
