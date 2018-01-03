// Packages
const ora = require('ora')
const { green, red } = require('chalk')

// Check whether we're in a terminal or not
const { isTTY } = process.stdout

exports.create = text => {
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

exports.clear = (message, isError) => {
  if (!isTTY) {
    console.log(`[pack] ${message}`)
    return
  }

  if (spinner) {
    (isError ? spinner.fail() : spinner.succeed())
    delete global.spinner
  }

  const prefix = isError ? red('Error!') : green('Done!')
  console.log(`\n${prefix} ${message}`)
}

exports.fail = message => {
  exports.clear(message, true)
  process.exit(1)
}
