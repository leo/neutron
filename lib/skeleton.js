// Native
const { join } = require('path')
const { exec: defaultExec } = require('child_process')
const { promisify } = require('util')

// Packages
const fs = require('fs-extra')
const download = require('download')
const tmp = require('tmp-promise')

// Utilities
const { info, error } = require('./log')
const spinner = require('./utils/spinner')

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

const downloadSkeleton = async () => {
  // Let the user know what we're doing
  spinner.create('Downloading boilerplate')

  // Ensure files get removed if process
  // exits because of an error
  tmp.setGracefulCleanup()

  // Create a temporary directory
  const { path, cleanup } = await tmp.dir({
    keep: true,
    unsafeCleanup: true
  })

  // Where to pull the boilerplate from
  const url = 'https://github.com/leo/electron-next-skeleton/zipball/master'

  // Download the boilerplate
  try {
    await download(url, path, {
      extract: true
    })
  } catch (err) {
    console.error(error('Not able to download boilerplate'))
    process.exit(1)
  }

  // Check where to find unzipped directory
  const contents = await fs.readdir(path)
  const location = join(path, contents[0])

  // Hand back the directory
  return {
    location,
    cleanup
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

  let changers = new Set()

  for (const file of modify) {
    changers.add(adjustContent(location, file, name))
  }

  await Promise.all(changers)
}

const moveSkeleton = async (location, target, cleanup) => {
  // Let the user know what we're doing
  spinner.create('Moving boilerplate into place')

  // Copy modified skeleton into the right location
  await fs.copy(location, target)

  // Remove temporary directory
  cleanup()
}

const installDependencies = async cwd => {
  spinner.create('Installing dependencies')

  const command = 'npm install'
  const exec = promisify(defaultExec)

  let stderr

  try {
    ({ stderr } = await exec(command, { cwd }))
  } catch (err) {
    console.error(error('Not able to install dependencies'))
    process.exit(1)
  }

  if (stderr) {
    console.error(error(`An error occurred: ${output.stderr}`))
    process.exit(1)
  }
}

module.exports = async name => {
  const target = join(process.cwd(), name)

  // Check whether the target directory already exists
  await checkExistance(target, name)

  // Pull the latest version of the boilerplate
  // from its GitHub repository
  const { location, cleanup } = await downloadSkeleton()

  // Set the meta properties appropiately
  await setMeta(location, name)

  // Copy the boilerplate into its correct
  // location and leave no trace
  await moveSkeleton(location, target, cleanup)

  // Run `npm install` inside the boilerplate
  await installDependencies(target)

  spinner.clear(`Run \`npm start\` inside of "${name}" to start the app`)
}
