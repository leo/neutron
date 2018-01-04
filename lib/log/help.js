// Packages
const { yellow, grey } = require('chalk')

module.exports = `
  Usage: ${yellow('bundle')} [options] <command | path>

  Commands:

    ${yellow('help')}          Show the usage information
    ${yellow('init')}  ${grey('[name]')}  Generate the boilerplate for a new app

  Options:

    ${yellow('-o, --output')}    Path of output directory (relative to working directory)
    ${yellow('-h, --help')}      Show the usage information
    ${yellow('-v, --version')}   Show the version number
`
