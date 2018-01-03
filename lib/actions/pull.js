// Native
const { platform } = require('os')
const { resolve, dirname } = require('path')

// Packages
const fs = require('fs-extra')

// Utilities
const spinner = require('../spinner')

const getBinaryName = () => {
  const os = platform()

  switch (os) {
    case 'darwin':
      return 'Electron.app'
    case 'win32':
      return 'electron.exe'
    default:
      throw new Error(`Your platform (${os}) is not yet supported`)
  }
}

const getBinaryPath = () => {
  const modules = resolve(process.cwd(), 'node_modules')

  let index
  let name

  try {
    index = require.resolve('electron', {
      paths: [ modules ]
    })
  } catch (err) {
    spinner.fail('The "electron" dependency is not installed')
    return
  }

  try {
    name = getBinaryName()
  } catch (err) {
    spinner.fail(err.message)
    return
  }

  return {
    name,
    location: resolve(dirname(index), 'dist', name)
  }
}

module.exports = async output => {
  // Let user know what we're doing
  spinner.create('Preparing bundle')

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
