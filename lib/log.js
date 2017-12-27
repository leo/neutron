const { yellow, red } = require('chalk')

exports.help = `
  Usage: ${yellow('pack')} [options] <command | path>

  Commands:

    ${yellow('help')}  Show the usage information

  Options:

    ${yellow('-o, --output')}    Path of output directory (relative to working directory)
    ${yellow('-h, --help')}      Show the usage information
    ${yellow('-v, --version')}   Show the version number
`

exports.error = reason => `${red('Error!')} ${reason}`
