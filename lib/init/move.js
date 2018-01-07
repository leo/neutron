// Packages
const fs = require('fs-extra')

// Utilities
const spinner = require('../spinner')

module.exports = async (location, target) => {
  // Let the user know what we're doing
  spinner.create('Moving boilerplate into place')

  // Copy modified skeleton into the right location
  await fs.copy(location, target)
}
