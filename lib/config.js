// Native
const { join } = require('path')

// Packages
const { pathExists, readJSON } = require('fs-extra')

// Utilities
const { error } = require('./log')

module.exports = async cwd => {
  const location = join(cwd, 'package.json')

  if (!await pathExists(location)) {
    console.error(error('The `package.json` file doesn\'t exist'))
    process.exit(1)
  }

  let version
  let pack

  try {
    ({ version, pack } = await readJSON(location))
  } catch (err) {
    console.error(error('Not able to read the `package.json` file'))
    process.exit(1)
  }

  if (!pack || !pack.name) {
    console.error(error('Please specify `pack.name` inside `package.json`'))
    process.exit(1)
  }

  if (!version) {
    console.error(error('Please specify `version` inside `package.json`'))
    process.exit(1)
  }

  return {
    ...pack,
    slug: pack.name.toLowerCase(),
    version
  }
}
