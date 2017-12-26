#!/usr/bin/env node

const { resolve } = require('path')
const parse = require('arg')
const package = require('../package')
const { help } = require('../lib/log')
const prepareBase = require('../lib/skeleton')
const clean = require('../lib/clean')

const args = parse({
  '--version': Boolean,
  '--help': Boolean,
  '--output': String,
  '-v': '--version',
  '-h': '--help',
  '-o': '--output'
})

if (args['--version']) {
  console.log(package.version)
  process.exit(0)
}

const sub = new Set(args._)

if (args['--help'] || sub.has('help')) {
  console.log(help)
  process.exit(0)
}

const main = async () => {
  const output = resolve(process.cwd(), args['--output'] || 'out')

  await clean(output)
  await prepareBase(output)

  console.log('done')
}

// Let's rock this
main()
