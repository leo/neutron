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

const adjustContent = async (location, file) => {
  const path = join(location, file)
  const content = await fs.readJSON(path)

  await fs.writeJSON(path, {
    ...content,
    name: 'my-app'
  }, {
    spaces: 2
  })
}

const setMeta = async location => {
  console.log(info('Setting meta information'))

  const modify = [
    'package.json',
    'package-lock.json'
  ]

  let changers = new Set()

  for (const file of modify) {
    changers.add(adjustContent(location, file))
  }

  await Promise.all(changers)
}

const installDependencies = async cwd => {
  console.log(info('Installing dependencies'))

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

module.exports = async () => {
  console.log(info('Downloading boilerplate'))

  // Create a temporary directory
  const tmpDir = await tmp.dir({
    keep: true,
    unsafeCleanup: true
  })

  // Ensure files get removed if process
  // exits because of an error
  tmp.setGracefulCleanup()

  // Where to pull the boilerplate from
  const url = 'https://github.com/leo/electron-next-skeleton/zipball/master'

  // Download the boilerplate
  try {
    await download(url, tmpDir.path, {
      extract: true
    })
  } catch (err) {
    console.error(error('Not able to download boilerplate'))
    process.exit(1)
  }

  // Check where to find unzipped directory
  const contents = await fs.readdir(tmpDir.path)
  const location = join(tmpDir.path, contents[0])

  await setMeta(location)
  const target = join(process.cwd(), 'my-app')

  console.log(info('Moving boilerplate into place'))
  await fs.copy(location, target)

  // Remove temporary directory
  tmpDir.cleanup()

  await installDependencies(target)

  console.log(info('Done! 🎉'))
}
