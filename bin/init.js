// Native
const { join } = require('path')
const { exec: defaultExec } = require('child_process')
const { promisify } = require('util')

// Packages
const fs = require('fs-extra')
const parse = require('arg')

// Utilities
const spinner = require('../lib/log/spinner')
const help = require('../lib/log/help')

const checkExistance = async (target, name) => {
  // Check if the directory is there
  if (!await fs.pathExists(target)) {
    return
  }

  // Ask the user whether he wants to overwrite
  const question = `Directory "${name}" already exists. Overwrite?`
  const overwrite = await spinner.prompt(question)

  // If he chose not to overwrite, don't do anything
  // and stop the process
  if (!overwrite) {
    spinner.clear('No action was taken')
    process.exit(0)
  }
}

const adjustContent = async (location, file, name) => {
  const path = join(location, file)
  const content = await fs.readJSON(path)

  await fs.writeJSON(path, {
    ...content,
    name
  }, {
    spaces: 2
  })
}

const setMeta = async (location, name) => {
  spinner.create('Setting meta information')

  const modify = [
    'package.json',
    'package-lock.json'
  ]

  const changers = []

  for (const file of modify) {
    changers.push(adjustContent(location, file, name))
  }

  await Promise.all(changers)
}

const moveSkeleton = async (location, target) => {
  // Let the user know what we're doing
  spinner.create('Moving boilerplate into place')

  // Copy modified skeleton into the right location
  await fs.copy(location, target)
}

const installDependencies = async cwd => {
  spinner.create('Installing dependencies')

  const command = 'npm install'
  const exec = promisify(defaultExec)

  let stderr

  try {
    ({ stderr } = await exec(command, { cwd }))
  } catch (err) {
    spinner.fail('Not able to install dependencies')
    return
  }

  if (stderr && !stderr.includes('npm WARN')) {
    spinner.fail(`An error occurred: ${stderr}`)
  }
}

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
