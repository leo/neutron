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

module.exports = async (directory, appName) => {
  const include = [
    'node_modules',
    'main',
    'renderer',
    'package.json'
  ]

  const target = join(directory, `${appName}.app/Contents/Resources/app.asar`)
  const files = await globby(include, { nodir: false })

  await pack(target, files)
}
