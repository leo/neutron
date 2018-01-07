#!/usr/bin/env node

// Native
const cluster = require('cluster')

// Packages
const parse = require('arg')

// Utilities
const help = require('../lib/help')
const runElectron = require('../lib/dev/electron')
const runNext = require('../lib/dev/next')

// Parse the supplied commands and options
const { _: sub, ...args } = parse({
  '--help': Boolean,
  '-h': '--help'
})

module.exports = async () => {
  if (args['--help']) {
    console.log(help.dev)
    process.exit(0)
  }

  if (cluster.isMaster) {
    // Once Next.js has started serving on a port, we
    // can start Electron. If we do it before, the
    // pages won't render properly.
    cluster.on('listening', runElectron)

    // Create a child process for Next.js to run in
    cluster.fork()

    // Don't do anything else
    return
  }

  // In the forked-out child process, run Next.js
  runNext()
}
