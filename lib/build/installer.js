// Native
const { join } = require('path')

// Packages
const fs = require('fs-extra')
const createDMG = require('electron-installer-dmg')

// Utilities
const spinner = require('../spinner')

module.exports = (outputDir, appPath, config) => new Promise(async resolve => {
  spinner.create('Generating installation wizard')

  const { name, slug, version } = config
  const background = join(__dirname, '../../assets/background.png')
  const dmgPath = join(outputDir, `${slug}-${version}.dmg`)

  const contents = [
    {
      x: 420,
      y: 150,
      type: 'link',
      path: '/Applications'
    },
    {
      x: 125,
      y: 150,
      type: 'file',
      path: appPath
    }
  ]

  createDMG({
    name,
    appPath,
    dmgPath,
    background,
    overwrite: true,
    contents
  }, err => {
    if (err) {
      spinner.fail('Not able to generate installer')
    }

    resolve()
  })
})
