// Native
const { arch, platform } = require('os')

// Packages
const { yellow, red, grey } = require('chalk')

exports.help = `
  Usage: ${yellow('pack')} [options] <command | path>

  Commands:

    ${yellow('help')}          Show the usage information
    ${yellow('init')}  ${grey('[name]')}  Generate the boilerplate for a new app

  Options:

    ${yellow('-o, --output')}    Path of output directory (relative to working directory)
    ${yellow('-h, --help')}      Show the usage information
    ${yellow('-v, --version')}   Show the version number
`

exports.error = reason => `${red('Error!')} ${reason}`
exports.info = message => `${yellow('[pack]')} ${message}`

exports.os = () => {
  const names = {
    darwin: 'macOS',
    win32: 'Windows'
  }

  const arches = {
    x64: '64-bit',
    x32: '32-bit',
    x86: '32-bit'
  }

  return `${names[platform()]} on ${arches[arch()]}`
}
