// Native
const { join } = require('path')

// Packages
const fs = require('fs-extra')

// Utilities
const spinner = require('../spinner')

module.exports = async (location, name) => {
  spinner.create('Setting meta information')

  const path = join(location, 'package.json')
  const content = await fs.readJSON(path)

  await fs.writeJSON(path, {
    ...content,
    name
  }, {
    spaces: 2
  })
}
