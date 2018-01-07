// Native
const { join } = require('path')

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

  let version
  let neutron
  let name

  try {
    ({ name, version, neutron } = await readJSON(location))
  } catch (err) {
    spinner.fail('Not able to read the `package.json` file')
    return
  }

  if (!neutron) {
    neutron = {}
  }

  if (!neutron.name && name) {
    neutron.name = capitalize.words(name.replace('-', ' '))
  } else if (!name) {
    spinner.fail('Please set `name` or `neutron.name` inside `package.json`')
    return
  }

  if (!version) {
    spinner.fail('Please specify `version` inside `package.json`')
    return
  }

  if (typeof neutron.asar === 'undefined') {
    neutron.asar = true
  }

  return {
    ...neutron,
    slug: dashify(neutron.name ? neutron.name : name),
    version
  }
}
