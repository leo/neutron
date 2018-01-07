// Native
const { exec: defaultExec } = require('child_process')
const { promisify } = require('util')

// Utilities
const spinner = require('../spinner')

module.exports = async cwd => {
  spinner.create('Installing dependencies')

  const command = 'npm install'
  const exec = promisify(defaultExec)

  let stderr

  try {
    ({ stderr } = await exec(command, { cwd }))
  } catch (err) {
    spinner.fail('Not able to install dependencies')
    return
  }

  if (stderr && !stderr.includes('npm WARN')) {
    spinner.fail(`An error occurred: ${stderr}`)
  }
}
