#!/usr/bin/env node

const parse = require('arg')
const package = require('../package')
const help = require('../lib/help')

const args = parse({
  '--version': Boolean,
  '--help': Boolean,
  '-v': '--version',
  '-h': '--help'
})

const sub = new Set(args._)

if (args['--version']) {
  console.log(package.version)
  process.exit(0)
}

if (args['--help'] || sub.has('help')) {
  console.log(help)
  process.exit(0)
}

console.log('I am mini')
