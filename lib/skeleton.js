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
const { createSpinner, clearSpinner } = require('./utils/spinner')

const downloadSkeleton = async () => {
  // Let the user know what we're doing
  createSpinner('Downloading boilerplate')

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
  createSpinner('Setting meta information')

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
  createSpinner('Moving boilerplate into place')

  // Copy modified skeleton into the right location
  await fs.copy(location, target)

  // Remove temporary directory
  cleanup()
}

const installDependencies = async cwd => {
  createSpinner('Installing dependencies')

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

  clearSpinner(`Run \`npm start\` inside of "${name}" to start the app`)
}
