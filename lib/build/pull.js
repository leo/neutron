// Native
const { resolve, dirname } = require('path')

// Packages
const fs = require('fs-extra')

// Utilities
const spinner = require('../spinner')

const getBinaryPath = () => {
  const modules = resolve(process.cwd(), 'node_modules')
  let index

  try {
    index = require.resolve('electron', {
      paths: [ modules ]
    })
  } catch (err) {
    spinner.fail('The "electron" dependency is not installed')
    return
  }

  const isWin = process.platform === 'win32'
  const suffix = isWin ? '' : 'Electron.app'
  const name = Boolean(suffix) ? suffix : 'electron'

  return {
    name,
    location: resolve(dirname(index), 'dist', suffix)
  }
}

module.exports = async output => {
  // Load the location of the pre-built Electron binary. It's
  // important that we do this before ensuring that the output
  // directory exists, so that the directory only gets
  // created if the dependency is ready.
  const { name, location } = getBinaryPath()

  // Ensure sure that the output directory exists
  await fs.ensureDir(output)

  // Place the pre-built binary in the output dir
  await fs.copy(location, resolve(output, name))
}
