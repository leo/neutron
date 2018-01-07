// Native
const { join } = require('path')
const { exec: defaultExec } = require('child_process')
const { promisify } = require('util')

// Utilities
const spinner = require('../spinner')

module.exports = async () => {
  spinner.create('Building renderer code')

  const cwd = process.cwd()
  const pre = join(cwd, 'node_modules', 'next', 'dist', 'bin', 'next')
  const renderer = join(cwd, 'renderer')

  const exec = promisify(defaultExec)
  let stderr

  try {
    ({ stderr } = await exec(`${pre} build ${renderer}`))
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
    ({ stderr } = await exec(`${pre} export ${renderer}`))
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
