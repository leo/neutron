// Native
const { join } = require('path')

// Packages
const { pathExists, readJSON } = require('fs-extra')
const dashify = require('dashify')
const capitalize = require('capitalize')

// Utilities
const spinner = require('./log/spinner')

module.exports = async cwd => {
  const location = join(cwd, 'package.json')

  if (!await pathExists(location)) {
    spinner.fail('The `package.json` file doesn\'t exist')
    return
  }

  let version
  let bundle
  let name

  try {
    ({ name, version, bundle } = await readJSON(location))
  } catch (err) {
    spinner.fail('Not able to read the `package.json` file')
    return
  }

  if (!bundle) {
    bundle = {}
  }

  if (!bundle.name && name) {
    bundle.name = capitalize.words(name.replace('-', ' '))
  } else if (!name) {
    spinner.fail('Please set `name` or `bundle.name` inside `package.json`')
    return
  }

  if (!version) {
    spinner.fail('Please specify `version` inside `package.json`')
    return
  }

  return {
    ...bundle,
    slug: dashify(bundle.name ? bundle.name : name),
    version
  }
}
