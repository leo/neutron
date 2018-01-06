// Packages
const ora = require('ora')
const { green, red } = require('chalk')
const { prompt } = require('inquirer')

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

  // Create a new spinner and make
  // it accessible through the whole process
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

  const { spinner } = global

  if (spinner) {
    (isError ? spinner.fail() : spinner.succeed())
    delete global.spinner

    // Print a new line for good style
    console.log('')
  }

  // Change the wording depending on the type of message
  const prefix = isError ? red('Error!') : green('Done!')

  // Print it out to the console
  console.log(`${prefix} ${message}`)
}

exports.fail = message => {
  // Print the error to the console
  exports.clear(message, true)

  // Stop the process with code 1
  process.exit(1)
}

exports.prompt = async message => {
  if (!isTTY) {
    return true
  }

  const { spinner } = global

  if (spinner) {
    spinner.succeed()
    delete global.spinner

    // Print a new line for good style
    console.log('')
  }

  // Ask the question
  const answers = await prompt([
    {
      type: 'confirm',
      message,
      name: 'check'
    }
  ])

  // Hand back the result
  return answers.check
}
