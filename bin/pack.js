#!/usr/bin/env node

// Native
const { resolve } = require('path')

// Packages
const parse = require('arg')
const { pathExists } = require('fs-extra')

// Utilities
const package = require('../package')
const { help } = require('../lib/log')
const prepareBase = require('../lib/skeleton')
const clean = require('../lib/clean')
const setInfo = require('../lib/info')
const createBundle = require('../lib/bundle')

const { _, ...args } = parse({
  '--version': Boolean,
  '--help': Boolean,
  '--output': String,
  '-v': '--version',
  '-h': '--help',
  '-o': '--output'
})

const subSpec = [ 'help' ]
const sub = subSpec[subSpec.indexOf(_[0])]

const main = async () => {
  let path = process.cwd()

  if (!sub && _[0]) {
    const resolved = resolve(path, _[0])

    if (await pathExists(resolved)) {
      path = resolved
    }
  }

  if (args['--version']) {
    console.log(package.version)
    process.exit(0)
  }

  if (args['--help'] || sub === 'help') {
    console.log(help)
    process.exit(0)
  }

  const output = resolve(path, args['--output'] || 'out')
  const appName = 'Now'

  // Ensure we can start fresh by cleaning up the old output
  await clean(output)

  // But the pre-built Electron binary into place
  await prepareBase(output)

  // Prepare the meta files and name everything correctly
  await setInfo(output, appName)

  // Bundle all the application into an `.asar` archive
  await createBundle(path, output, appName)

  // Let the user know we're done
  console.log('Done!')
}

// Let's rock this
main()
