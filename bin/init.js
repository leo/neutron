// Native
const { join } = require('path')

// Packages
const parse = require('arg')

// Utilities
const spinner = require('../lib/spinner')
const help = require('../lib/help')
const checkExistance = require('../lib/init/exists')
const installDependencies = require('../lib/init/deps')
const setMeta = require('../lib/init/meta')
const moveSkeleton = require('../lib/init/move')

// Parse the supplied commands and options
const { _: sub, ...args } = parse({
  '--help': Boolean,
  '-h': '--help'
})

module.exports = async () => {
  const name = sub[1] || 'my-app'

  if (args['--help']) {
    console.log(help.init)
    process.exit(0)
  }

  const origin = join(__dirname, '..', 'template')
  const target = join(process.cwd(), name)

  // Check whether the target directory already exists
  await checkExistance(target, name)

  // Copy the boilerplate into its correct
  // location and leave no trace
  await moveSkeleton(origin, target)

  // Set the meta properties appropiately
  await setMeta(target, name)

  // Run `npm install` inside the boilerplate
  await installDependencies(target)

  spinner.clear(`Run \`npm start\` inside of "${name}" to start the app`)
}
