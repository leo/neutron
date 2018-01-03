// Packages
const ora = require('ora')
const { green } = require('chalk')

// Check whether we're in a terminal or not
const { isTTY } = process.stdout

exports.createSpinner = text => {
  if (!isTTY) {
    console.log(`[pack] ${text}`)
    return
  }

  const { spinner } = global

  if (spinner) {
    spinner.succeed()
    delete global.spinner
  }

  global.spinner = ora({
    text,
    color: 'magenta'
  }).start()
}

exports.clearSpinner = message => {
  if (!isTTY) {
    console.log(`[pack] ${message}`)
    return
  }

  if (spinner) {
    spinner.succeed()
    delete global.spinner
  }

  console.log(`\n${green('Done!')} ${message}`)
}
