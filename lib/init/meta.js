// Native
const { join } = require('path')

// Packages
const fs = require('fs-extra')

// Utilities
const spinner = require('../spinner')

const adjustContent = async (location, file, name) => {
  const path = join(location, file)
  const content = await fs.readJSON(path)

  await fs.writeJSON(path, {
    ...content,
    name
  }, {
    spaces: 2
  })
}

module.exports = async (location, name) => {
  spinner.create('Setting meta information')

  const modify = [
    'package.json',
    'package-lock.json'
  ]

  const changers = []

  for (const file of modify) {
    changers.push(adjustContent(location, file, name))
  }

  await Promise.all(changers)
}
