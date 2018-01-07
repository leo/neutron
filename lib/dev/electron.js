// Native
const { join } = require('path')
const { spawn } = require('child_process')

// Utilites
const spinner = require('../spinner')

module.exports = async () => {
  const cwd = process.cwd()
  let binaryPath

  try {
    const index = require.resolve('electron', {
      paths: [
        join(cwd, 'node_modules')
      ]
    })

    binaryPath = require(index)
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') {
      spinner.fail(`Your project is missing the ${'`electron`'} dependency`)
    }

    spinner.fail(`Not able to load the ${'`electron`'} dependency`)
  }

  const child = spawn(binaryPath, [ cwd ], {
    stdio: 'inherit'
  })

  setTimeout(() => {
    child.kill()
  }, 5000)
}
