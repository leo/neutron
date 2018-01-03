// Packages
const { pathExists, remove } = require('fs-extra')

// Utilities
const spinner = require('../log/spinner')

module.exports = async directory => {
  // Do nothing if the output directory doesn't exist
  if (!await pathExists(directory)) {
    return
  }

  spinner.create('Cleaning up previous build')

  // However, if it does, clean it up
  try {
    await remove(directory)
  } catch (err) {
    spinner.fail('Not able to clean up output directory')
  }
}
