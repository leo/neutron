// Native
const { join, resolve } = require('path')

// Packages
const { pathExists, readJSON } = require('fs-extra')
const dashify = require('dashify')
const capitalize = require('capitalize')

// Utilities
const spinner = require('./spinner')

module.exports = async cwd => {
  const location = join(cwd, 'package.json')

  if (!await pathExists(location)) {
    spinner.fail('The `package.json` file doesn\'t exist')
    return
  }

  const defaultConfig = {
    asar: true,
    macOS: {
      icon: './main/static/mac.icns'
    },
    windows: {
      icon: './main/static/windows.ico'
    }
  }

  let packageConfig

  try {
    packageConfig = await readJSON(location)
  } catch (err) {
    spinner.fail('Not able to read the `package.json` file')
    return
  }

  if (!packageConfig.version) {
    spinner.fail('Please specify `version` inside `package.json`')
    return
  }

  const config = Object.assign(defaultConfig, packageConfig.neutron || {}, {
    version: packageConfig.version
  })

  if (!config.name && packageConfig.name) {
    config.name = capitalize.words(packageConfig.name.replace('-', ' '))
  } else if (!packageConfig.name) {
    spinner.fail('Please set `name` or `neutron.name` inside `package.json`')
    return
  }

  config.slug = dashify(config.name)

  config.macOS.icon = resolve(cwd, config.macOS.icon)
  config.windows.icon = resolve(cwd, config.windows.icon)

  return config
}
