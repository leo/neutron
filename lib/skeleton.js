const { platform } = require('os')
const { resolve, dirname } = require('path')
const fs = require('fs-extra')
const { error } = require('./log')

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
    console.error(error('The "electron" dependency is not installed'))
    process.exit(0)
  }

  try {
    name = getBinaryName()
  } catch (err) {
    console.error(error(err.message))
    process.exit(0)
  }

  return {
    name,
    location: resolve(dirname(index), 'dist', name)
  }
}

module.exports = async output => {
  // Ensure sure that the output directory exists
  await fs.ensureDir(output)

  // Load the location of the pre-built Electron binary
  const { name, location } = getBinaryPath()

  // Place the pre-built binary in the output dir
  await fs.copy(location, resolve(output, name))
}
