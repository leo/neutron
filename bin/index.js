#!/usr/bin/env node

// Packages
const parse = require('arg')

// Utilities
const package = require('../package')
const spinner = require('../lib/log/spinner')
const help = require('../lib/log/help')

// Parse the supplied commands and options
const { _: sub, ...args } = parse({
  '--version': Boolean,
  '--help': Boolean,
  '-v': '--version',
  '-h': '--help'
})

// Output the package's version if
// the `--version was supplied
if (args['--version']) {
  console.log(package.version)
  process.exit(0)
}

// Just like in Next.js, we'll fall back to
// the `dev` sub command if none was specified
if (!sub[0]) {
  sub[0] = 'dev'

  if (args['--help']) {
    console.log(help.dev)
    process.exit(0)
  }
}

// Try to load the sub command
try {
  require(`./${sub[0]}.js`)()
} catch (err) {
  // Ensure missing modules from required files
  // still lead to an error
  if (!err.stack.includes('bin/index')) {
    throw err
    return
  }

  // If it wasn't possible, we might not support it
  if (err.code === 'MODULE_NOT_FOUND') {
    spinner.fail('The specified sub command is not supported')
    return
  }

  // ...or it was just the program's fault
  spinner.fail(`Not able to load the "${sub[0]}" sub command`)
}
