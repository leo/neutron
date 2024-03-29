#!/usr/bin/env node

// Native
const { resolve, basename, join } = require('path')

// Packages
const parse = require('arg')
const { remove, readJSON } = require('fs-extra')

// Utilities
const help = require('../lib/help')
const prepareBase = require('../lib/build/pull')
const clean = require('../lib/build/clean')
const setInfo = require('../lib/build/set-info')
const createBundle = require('../lib/build/bundle')
const getConfig = require('../lib/config')
const spinner = require('../lib/spinner')
const exportRenderer = require('../lib/build/export')
const compress = require('../lib/build/compress')
const createInstaller = require('../lib/build/installer')
const createRelease = require('../lib/build/release')
const lifecycle = require('../lib/build/lifecycle')
const codeSign = require('../lib/build/code-sign')

// Parse the supplied commands and options
const { _: sub, ...args } = parse({
  '--production': Boolean,
  '--help': Boolean,
  '--output': String,
  '-h': '--help',
  '-o': '--output',
  '-p': '--production'
})

module.exports = async () => {
  const cwd = process.cwd()
  const pkg = await readJSON(join(cwd, 'package.json'))
  const isWin = process.platform === 'win32'
  const { NODE_ENV, CI } = process.env
  const { isTTY } = CI ? false : process.stdout

  if (args['--help']) {
    console.log(help.build)
    process.exit(0)
  }

  // On CI services, we should always
  // generate the distribution bundles
  if (CI || NODE_ENV === 'production') {
    args['--production'] = true
  }

  const output = resolve(cwd, args['--output'] || 'out')
  const config = await getConfig(cwd)

  // Build and export the renderer code
  await exportRenderer()

  // Ensure we can start fresh by cleaning up the old output
  await clean(output)

  // But the pre-built Electron binary into place
  await prepareBase(output)

  // Prepare the meta files and name everything correctly
  await setInfo(output, config)

  // Bundle all the application into an `.asar` archive
  await lifecycle(cwd, pkg, 'before-bundle')
  const bundle = await createBundle(cwd, output, config)
  await lifecycle(cwd, pkg, 'after-bundle')


  if (args['--production']) {
    await codeSign(cwd, output, config)
  }

  if (args['--production'] || isWin) {
    // Create archive and installers from the bundle
    await compress(output, bundle, config)
    await createInstaller(output, bundle, config, cwd)

    // Delete the original
    await remove(bundle)
  }

  const directory = basename(output)
  let finalNotice = `You can find your bundled app in "${directory}"`

  if (CI) {
    await createRelease(output, config)
    finalNotice = 'Finished'
  }

  if (!isTTY) {
    // Print empty line to ensure output looks great
    process.stdout.write('\n')
  }

  spinner.clear(finalNotice)
}
