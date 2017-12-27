// Native
const { join } = require('path')

// Packages
const asar = require('asar')
const globby = require('globby')
const fs = require('fs-extra')

// Utilities
const { error } = require('./log')

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

const getDependencies = async () => {
  const lockfile = join(process.cwd(), 'package-lock.json')

  if (!await fs.pathExists(lockfile)) {
    console.error(error(`The "package-lock.json" file doesn't exist`))
    process.exit(1)
  }

  const { dependencies: deps } = await fs.readJSON(lockfile)
  const list = Object.keys(deps).filter(item => !deps[item].dev)

  return list.map(item => join('node_modules', item))
}

module.exports = async (directory, appName) => {
  const include = [
    'main',
    'renderer/out',
    'package.json',
    ...await getDependencies()
  ]

  const remove = [
    'default_app.asar'
  ]

  const parent = join(directory, `${appName}.app/Contents/Resources`)
  const target = join(parent, `app.asar`)

  // The items within this collection won't be walked. Not their
  // contents will be included – only their actual representation
  // in the file system.
  const files = [
    'renderer',
    'node_modules',
    ...await globby(include, { nodir: false })
  ]

  // Create the `.asar` bundle with all necessary files
  await pack(target, files)

  // Remove any useless files from the bundle
  await clear(parent, remove)
}
