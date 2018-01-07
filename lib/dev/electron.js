// Native
const { join, dirname } = require('path')
const { spawn } = require('child_process')
const cluster = require('cluster')

// Packages
const resolveBin = require('resolve-binary')

// Utilites
const spinner = require('../spinner')

module.exports = async () => {
  const cwd = process.cwd()
  let binaryPath

  try {
    binaryPath = await resolveBin('electron', {
      paths: [
        join(cwd, 'node_modules')
      ]
    })
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') {
      spinner.fail(`Your project is missing the ${'`electron`'} dependency`)
    }

    spinner.fail(`Not able to load the ${'`electron`'} dependency`)
  }

  spawn(binaryPath, [ cwd ], {
    stdio: 'inherit'
  })
}
