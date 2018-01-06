#!/usr/bin/env node

// Native
const { resolve, basename } = require('path')

// Packages
const parse = require('arg')

// Utilities
const package = require('../package')
const help = require('../lib/log/help')
const prepareBase = require('../lib/actions/pull')
const clean = require('../lib/actions/clean')
const setInfo = require('../lib/actions/set-info')
const createBundle = require('../lib/actions/bundle')
const getConfig = require('../lib/config')
const spinner = require('../lib/log/spinner')

// Parse the supplied commands and options
const { _: sub, ...args } = parse({
  '--help': Boolean,
  '--output': String,
  '-h': '--help',
  '-o': '--output'
})

module.exports = async () => {
  const cwd = process.cwd()

  if (args['--help']) {
    console.log(help.build)
    process.exit(0)
  }

  const output = resolve(cwd, args['--output'] || 'out')
  const config = await getConfig(cwd)

  // Ensure we can start fresh by cleaning up the old output
  await clean(output)

  // But the pre-built Electron binary into place
  await prepareBase(output)

  // Prepare the meta files and name everything correctly
  await setInfo(output, config)

  // Bundle all the application into an `.asar` archive
  await createBundle(cwd, output, config)

  // Let the user know we're done
  const directory = basename(output)
  spinner.clear(`You can find your bundled app in "${directory}".`)
}
