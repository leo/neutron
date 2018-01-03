// Packages
const ora = require('ora')
const { green } = require('chalk')

exports.createSpinner = message => {
  const { spinner } = global

  if (spinner) {
    spinner.succeed()
    delete global.spinner
  }

  global.spinner = ora(message).start()
}

exports.clearSpinner = message => {
  if (spinner) {
    spinner.succeed()
    delete global.spinner
  }

  console.log(`\n${green('Done!')} ${message}`)
}
