import requireDirAll from 'require-dir-all'

const plugins = requireDirAll('./plugins')

function extend(helper = {}) {
  Object.keys(plugins).forEach((key) => {
    const plugin = plugins[key]
    helper[key] = plugin.default.bind(helper) // eslint-disable-line no-param-reassign
  })
}

export default { extend }
