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
const getConfig = require('../lib/config')

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
  let cwd = process.cwd()

  if (!sub && _[0]) {
    const resolved = resolve(cwd, _[0])

    if (await pathExists(resolved)) {
      cwd = resolved
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
  console.log('Done!')
}

// Let's rock this
main()
