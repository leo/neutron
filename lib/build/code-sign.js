// Native
const { join, basename, relative, sep } = require('path')

// Packages
const { signAsync: macOSSign, flatAsync: macOSSignFlat } = require('electron-osx-sign')
const dotProp = require('dot-prop')

// Utilities
const spinner = require('../spinner')

module.exports = async (workingDir, outputDir, config) => {
  const isMac = process.platform === 'darwin'
  const signatureConfig = dotProp.get(config, 'macOS.signature')
  
  if (isMac && signatureConfig) {
    spinner.create('Signing application')
    const app = join(outputDir, `${config.name}.app`)
    const { identity, entitlements } = signatureConfig
    try {
      await macOSSign({
        app,
        identity,
        entitlements,
        'entitlements-inherit': signatureConfig['entitlements-inherit']
      })
      if (signatureConfig.flat) {
        await macOSSignFlat({
          app,
          identity,
        })
      }
    } catch (err) {
      spinner.fail(`Signing application failed: ${err}`)
    }
  } else {
    console.log('Code signing is currently only supported on macOS (`darwin`) platform')
  }
}
