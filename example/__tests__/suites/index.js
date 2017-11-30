/* eslint-disable import/no-dynamic-require */
const { TEST_NAME, TEST_SUITE = 'ios' } = process.env

function requireFile(file, throwText) {
  try {
    return require(file)
  } catch (error) {
    throw throwText
  }
}

function requireTestFile(file) {
  return requireFile(
    `../${file}`,
    `Can not find test file with name: ${file}.js`
  )
}

function runTestSuites() {
  if (TEST_NAME) {
    const testNames = TEST_NAME.split(',')
    testNames.forEach(requireTestFile)
    return
  }

  const testSuite = requireFile(
    `./${TEST_SUITE}`,
    `Can not find any test suites with name: ${TEST_SUITE}.js`
  ).default

  testSuite.forEach(requireTestFile)
}

runTestSuites()
