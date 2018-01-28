// Native
const { join } = require('path')
const { exec: defaultExec } = require('child_process')
const { promisify } = require('util')

// Packages
const { remove } = require('fs-extra')

// Utilities
const spinner = require('../spinner')

module.exports = async (cwd, command = 'yarn') => {
  if (command == 'yarn') {
    spinner.create('Installing dependencies')
  }

  const exec = promisify(defaultExec)
  let stderr

  try {
    ({ stderr } = await exec(command, { cwd }))

    if (command === 'npm install') {
      await remove(join(cwd, 'yarn.lock'))
    }
  } catch (err) {
    if (command === 'yarn' && err.code === 127) {
      return module.exports(cwd, 'npm install')
    }

    spinner.fail('Not able to install dependencies')
    return
  }

  let check = stderr.includes('warning')

  if (command === 'npm install') {
    check = stderr.includes('npm WARN')
  }

  if (Boolean(stderr) && !check) {
    spinner.fail(`An error occurred: ${stderr}`)
  }

  return command
}
