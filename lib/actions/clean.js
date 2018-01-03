// Packages
const { pathExists, remove } = require('fs-extra')

// Utilities
const { error, info } = require('../log')

module.exports = async directory => {
  // Do nothing if the output directory doesn't exist
  if (!await pathExists(directory)) {
    return
  }

  console.log(info('Cleaning up previous build'))

  // However, if it does, clean it up
  try {
    await remove(directory)
  } catch (err) {
    console.error(error('Not able to clean up output directory'))
    process.exit(1)
  }
}
