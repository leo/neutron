#!/usr/bin/env node

// Native
const cluster = require('cluster')

// Packages
const parse = require('arg')

// Utilities
const help = require('../lib/help')
const prepareRenderer = require('../lib/dev/renderer')
const runMain = require('../lib/dev/main')

// Parse the supplied commands and options
const { _: sub, ...args } = parse({
  '--help': Boolean,
  '-h': '--help'
})

module.exports = async () => {
  const children = [
    'next',
    'electron'
  ]

  if (args['--help']) {
    console.log(help.dev)
    process.exit(0)
  }

  if (cluster.isMaster) {
    // Once Next.js has started serving on a port, we
    // can start Electron. If we do it before, the
    // pages won't render properly.
    cluster.on('listening', () => cluster.fork())

    // Create a child process for Next.js to run in
    cluster.fork()

    // Don't do anything else
    return
  }

  const { id } = cluster.worker
  const type = children[id - 1]

  if (type === 'next') {
    prepareRenderer()
  } else if (type === 'electron') {
    runMain()
  }
}
