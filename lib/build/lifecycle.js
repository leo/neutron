// Packages
const { spawn } = require('child-process-promise')

// Utilities
const spinner = require('../spinner')

const prefix = 'neutron'

module.exports = async (cwd, pkg, hook) => {
  const scriptName = [prefix, hook].join('-')

  if (!(pkg && pkg.scripts && pkg.scripts[scriptName])) {
    return
  }

  spinner.info(`Running ${scriptName} script`)

  await spawn('npm', ['run', scriptName], {
    cwd,
    detached: true,
    stdio: 'inherit'
  })
}
