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

const getDependencies = async directory => {
  const package = join(process.cwd(), 'package.json')
  const { dependencies } = await fs.readJSON(package)

  return Object.keys(dependencies).map(item => {
    return join('node_modules', item)
  })
}

module.exports = async (directory, appName) => {
  const include = [
    'main',
    'renderer/out',
    'package.json',
    'node_modules'
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
    ...await globby(include, { nodir: false })
  ]

  // Create the `.asar` bundle with all necessary files
  await pack(target, files)

  // Remove any useless files from the bundle
  await clear(parent, remove)
}
