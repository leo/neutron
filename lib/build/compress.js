// Native
const { join, basename } = require('path')

// Packages
const fs = require('fs-extra')
const archiver = require('archiver')

// Utilities
const spinner = require('../spinner')

module.exports = (outputDir, target, config) => new Promise(async resolve => {
  spinner.create('Wrapping bundle into a ZIP archive')

  const { slug, version } = config

  const name = `${slug}-${version}-mac.zip`
  const path = join(outputDir, name)
  const output = fs.createWriteStream(path)

  const archive = archiver('zip', {
    zlib: {
      level: 9
    }
  })

  output.on('close', () => {
    fs.remove(target).then(resolve)
  })

  archive.pipe(output)
  archive.directory(target, basename(target))
  archive.finalize()
})
