// Native
const { join } = require('path')
const { exec: defaultExec } = require('child_process')
const { promisify } = require('util')

// Packages
const resolveBin = require('resolve-binary')

// Utilities
const spinner = require('../spinner')

module.exports = async () => {
  spinner.create('Building renderer code')

  const cwd = process.cwd()
  let binaryPath

  try {
    binaryPath = await resolveBin('next', {
      paths: [
        join(cwd, 'node_modules')
      ]
    })
  } catch (err) {
    console.log(err)
    if (err.code === 'MODULE_NOT_FOUND') {
      spinner.fail(`Your project is missing the ${'`next`'} dependency`)
    }

    spinner.fail(`Not able to load the ${'`next`'} dependency`)
  }

  const renderer = join(cwd, 'renderer')
  const exec = promisify(defaultExec)

  let stderr

  try {
    ({ stderr } = await exec(`${binaryPath} build ${renderer}`))
  } catch (err) {
    spinner.fail('Not able to build renderer code')
    return
  }

  // Just pass the error on from Next.js, don't
  // apply any formatting at all
  if (stderr) {
    console.error(stderr)
    process.exit(1)
  }

  spinner.create('Generating static bundle from renderer code')

  try {
    ({ stderr } = await exec(`${binaryPath} export ${renderer}`))
  } catch (err) {
    spinner.fail('Not able to export renderer code')
    return
  }

  // Just pass the error on from Next.js, don't
  // apply any formatting at all
  if (stderr) {
    console.error(stderr)
    process.exit(1)
  }
}
