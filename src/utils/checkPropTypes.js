export default function checkPropTypes(typeSpecs, values, location, componentName) {
  if (process.env.NODE_ENV !== 'production') {
    for (var typeSpecName in typeSpecs) {
      if (typeSpecs.hasOwnProperty(typeSpecName)) {
        const error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null)
        if (error instanceof Error) {
          throw new Error('Failed %s type: %s%s', location, error.message)
        }
      }
    }
  }
}
