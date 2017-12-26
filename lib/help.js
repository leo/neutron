const { yellow } = require('chalk')

module.exports = `
  Usage: ${yellow('mini')} [options] [command]

  Commands:

    ${yellow('help')}  Show the usage information

  Options:

    ${yellow('-h, --help')}      Show the usage information
    ${yellow('-v, --version')}   Show the version number
`
