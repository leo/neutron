// Native
const { join } = require('path')

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

  console.log(info('Setting meta information'))
  await setMeta(location)

  console.log(info('Moving boilerplate into place'))
  await fs.copy(location, join(process.cwd(), 'my-app'))

  // Remove temporary directory
  tmpDir.cleanup()

  console.log(info('Done! 🎉'))
}
