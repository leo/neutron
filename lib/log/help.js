// Packages
const { yellow, grey } = require('chalk')

exports.dev = `
  Usage: ${yellow('neutron')} [options] <command | path>

  Commands:

    ${yellow('dev')}           Run the development tools (default)
    ${yellow('start')}         Start the application (in production)
    ${yellow('init')}  ${grey('[name]')}  Generate the boilerplate for a new app
    ${yellow('build')}         Create the production bundle

  Options:

    ${yellow('-h, --help')}      Show the usage information
    ${yellow('-v, --version')}   Show the version number
`

exports.build = `
  Usage: ${yellow('neutron build')} [options]

  Options:

    ${yellow('-o, --output')}    Path of output directory (relative to working directory)
    ${yellow('-h, --help')}      Show the usage information
    ${yellow('-v, --version')}   Show the version number
`

exports.init = `
  Usage: ${yellow('neutron init')} [options]

  Options:

    ${yellow('-h, --help')}      Show the usage information
    ${yellow('-v, --version')}   Show the version number
`
