// Native
const { join } = require('path')

// Packages
const chokidar = require('chokidar')
const spawn = require('respawn')

// Utilites
const spinner = require('../spinner')

module.exports = async () => {
  const cwd = process.cwd()
  const toWatch = join(cwd, 'main')

  let binaryPath

  try {
    const index = require.resolve('electron', {
      paths: [
        join(cwd, 'node_modules')
      ]
    })

    binaryPath = require(index)
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') {
      spinner.fail(`Your project is missing the ${'`electron`'} dependency`)
    }

    spinner.fail(`Not able to load the ${'`electron`'} dependency`)
  }

  const child = spawn([binaryPath, cwd], {
    name: 'main',
    cwd
  })

  child.start()

  const watcher = chokidar.watch(toWatch, {
    cwd: toWatch,
    disableGlobbing: true,
    ignored: [
      /(^|[/\\])\../,
      'node_modules'
		]
  })

  watcher.on('ready', () => {
    console.log('> Started watching main process code')
  })

  watcher.on('change', file => {
    if (child.status !== 'running') {
      return
    }

    console.log(`> \`${file}\` has changed, restarting main process...`)
    child.stop(() => child.start())
  })
}
