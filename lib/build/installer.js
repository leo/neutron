// Native
const { join, resolve } = require('path')

// Packages
const fs = require('fs-extra')
const generateDMG = require('electron-installer-dmg')
const generateEXE = require('electron-windows-installer')

// Utilities
const spinner = require('../spinner')

const createDMG = (outputDir, appPath, config) => new Promise(resolve => {
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

  generateDMG({
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

const createEXE = (outputDirectory, appDirectory, config, cwd) => {
  const { name: title, slug, version, windows } = config

  const setup = {
    appDirectory,
    outputDirectory,
    setupIcon: windows.setupIcon,
    iconUrl: windows.icon,
    authors: 'ACME, Inc.',
    version,
    setupExe: `${slug}-${version}-setup.exe`,
    title,
    exe: 'electron.exe'
  }

  if (!windows.msi) {
    setup.noMsi = true
  }

  if (windows.loadingGIF) {
    setup.loadingGif = resolve(cwd, windows.loadingGIF)
  }

  return generateEXE(setup)
}

module.exports = async (outputDir, appPath, config, cwd) => {
  spinner.create('Generating installation wizard')

  if (process.platform === 'darwin') {
    return createDMG(outputDir, appPath, config)
  }

  return createEXE(outputDir, appPath, config, cwd)
}
