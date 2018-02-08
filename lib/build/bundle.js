// Native
const { join, basename, relative } = require('path')
const { exec: defaultExec } = require('child_process')
const { promisify } = require('util')

// Packages
const asar = require('asar')
const globby = require('globby')
const { pathExists: exists, ...fs } = require('fs-extra')

// Utilities
const os = require('../os')
const spinner = require('../spinner')

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
  const removers = []

  for (const file of files) {
    const location = join(directory, file)
    removers.push(fs.remove(location))
  }

  return Promise.all(removers)
}

const getDependencies = async cwd => {
  // We need to ensure to make the process always
  // succeed, since npm is putting a lot of useless
  // errors into stderr.
  const command = 'npm ls --prod --parseable --silent || exit 0'
  const exec = promisify(defaultExec)

  let stdout

  try {
    ({ stdout } = await exec(command, { cwd }))
  } catch (err) {
    spinner.fail('Not able to run `npm ls` properly')
    return
  }

  const list = stdout.split('\n').map(dependency => {
    const path = relative(cwd, dependency)
    return path.split('/').length > 2 ? false : path
  })

  return new Set(list.filter(Boolean))
}

module.exports = async (workingDir, outputDir, { name, asar, slug }) => {
  spinner.create(`Bundling application for ${os}`)

  const include = [
    'main',
    'renderer/out',
    'package.json',
    ...await getDependencies(workingDir)
  ]

  const remove = [
    'electron.asar',
    'default_app.asar'
  ]

  const isWin = process.platform === 'win32'
  const main = join(outputDir, isWin ? 'electron' : `${name}.app`)
  const parent = join(main, isWin ? 'resources' : 'Contents/Resources')
  const target = join(parent, asar ? 'app.asar' : 'app')

  if (asar) {
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
  } else {
    const copiers = []

    for (const path of include) {
      const from = join(workingDir, path)
      const to = join(target, path)

      copiers.push(fs.copy(from, to))
    }

    // Copy all files into place, without an `.asar` archive
    await Promise.all(copiers)
  }

  // Remove any useless files from the bundle
  await clear(parent, remove)

  return main
}
