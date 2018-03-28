#!/usr/bin/env node

// Native
const { platform } = require('os')

// Packages
const parse = require('arg')
const { grey } = require('chalk')

// Utilities
const package = require('../package')
const spinner = require('../lib/spinner')
const help = require('../lib/help')

// Parse the supplied commands and options
const { _, ...args } = parse({
  '--production': Boolean,
  '--version': Boolean,
  '--help': Boolean,
  '--output': String,
  '-v': '--version',
  '-h': '--help',
  '-o': '--output',
  '-p': '--production'
})

// Check if a sub command was supplied
let run = _[0]

// Output the package's version if
// the `--version was supplied
if (args['--version']) {
  console.log(package.version)
  process.exit(0)
}

const supportedPlatforms = new Set([
  'win32',
  'darwin'
])

if (!supportedPlatforms.has(platform())) {
  spinner.fail('This platform is not yet supported')
}

// As there's no sub command needed for starting the
// application in production (Electron is set to load
// the main process code directly), we need
// to ensure to fall back to `dev` in those cases

// The same happens if no sub command was defined
if (!run || run === 'start') {
  run = 'dev'

  if (args['--help']) {
    console.log(help.dev)
    process.exit(0)
  }
}

// Try to load the sub command
try {
  require(`./${run}.js`)()
} catch (err) {
  // Ensure missing modules from required files
  // still lead to an error. Don't use a slash
  // in here, otherwise it breaks on Windows.
  if (!err.stack.includes('index.js')) {
    throw err
  }

  // If it wasn't possible, we might not support it
  if (err.code === 'MODULE_NOT_FOUND') {
    spinner.fail(`The sub command ${grey(`\`${_[0]}\``)} is not supported`)
    return
  }

  // ...or it was just the program's fault
  throw err
}
