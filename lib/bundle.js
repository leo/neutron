// Native
const { join, basename, relative } = require('path')
const { exec: defaultExec } = require('child_process')
const { promisify } = require('util')

// Packages
const asar = require('asar')
const globby = require('globby')
const { pathExists: exists, ...fs } = require('fs-extra')

// Utilities
const { error, info, os } = require('./log')

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

const getDependencies = async cwd => {
  const command = 'npm ls --prod --parseable'
  const exec = promisify(defaultExec)

  let stdout
  let stderr

  try {
    ({ stdout, stderr } = await exec(command, { cwd }))
  } catch (err) {
    console.error(error('Not able to run `npm ls` properly'))
    process.exit(1)
  }

  if (stderr) {
    console.error(error(`An error occurred: ${output.stderr}`))
    process.exit(1)
  }

  const list = stdout.split('\n').map(dependency => {
    const path = relative(cwd, dependency)
    return path.split('/').length > 2 ? false : path
  })

  return new Set(list.filter(Boolean))
}

module.exports = async (workingDir, outputDir, { name }) => {
  console.log(info(`Bundling application for ${os()}`))

  const include = [
    'main',
    'renderer/out',
    'package.json',
    ...await getDependencies(workingDir)
  ]

  const remove = [
    'default_app.asar'
  ]

  const parent = join(outputDir, `${name}.app/Contents/Resources`)
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
