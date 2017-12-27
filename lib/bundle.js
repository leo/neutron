// Native
const { join } = require('path')

// Packages
const asar = require('asar')
const globby = require('globby')
const fs = require('fs-extra')

const pack = (dest, files) => new Promise(async resolve => {
  const stats = {}

  for (const file of files) {
    const stat = await fs.stat(file)

    stats[file] = {
      type: stat.isDirectory() ? 'directory': 'file',
      stat
    }
  }

  asar.createPackageFromFiles(process.cwd(), dest, files, stats, {}, resolve)
})

const clear = async (directory, files) => {
  const removers = new Set()

  for (const file of files) {
    const location = join(directory, file)
    removers.add(fs.remove(location))
  }

  return Promise.all(removers)
}

module.exports = async (directory, appName) => {
  const include = [
    'node_modules',
    'main',
    'renderer',
    'package.json'
  ]

  const remove = [
    'default_app.asar'
  ]

  const parent = join(directory, `${appName}.app/Contents/Resources`)
  const target = join(parent, `app.asar`)
  const files = await globby(include, { nodir: false })

  // Create the `.asar` bundle with all necessary files
  await pack(target, files)

  // Remove any useless files from the bundle
  await clear(parent, remove)
}
