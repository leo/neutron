// Packages
const fs = require('fs-extra')

// Utilities
const spinner = require('../spinner')

module.exports = async (target, name) => {
  // Check if the directory is there
  if (!await fs.pathExists(target)) {
    return
  }

  // Ask the user whether he wants to overwrite
  const question = `Directory "${name}" already exists. Overwrite?`
  const overwrite = await spinner.prompt(question)

  // If he chose not to overwrite, don't do anything
  // and stop the process
  if (!overwrite) {
    spinner.clear('No action was taken')
    process.exit(0)
  }
}
