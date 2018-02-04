// Native
const { join } = require('path')

// Packages
const fs = require('fs-extra')
const createDMG = require('electron-installer-dmg')

// Utilities
const spinner = require('../spinner')

module.exports = (outputDir, target, config) => new Promise(async resolve => {
  spinner.create('Generating installation wizard')
  const { name, slug, version } = config

  createDMG({
    name,
    appPath: target,
    dmgPath: join(outputDir, `${slug}-${version}.dmg`),
    overwrite: true,
  }, err => {
    if (err) {
      spinner.fail('Not able to generate installer')
    }

    resolve()
  })
})
