// Native
const path = require('path')

// Packages
const walk = require('klaw')
const { rename } = require('fs-extra')

const getReplacables = directory => new Promise((resolve, reject) => {
  const paths = []

  const filter = item => path.extname(item) !== '.framework'
  const walker = walk(directory, { filter })

  walker.on('data', item => {
    const name = path.basename(item.path)

    if (!name.match(/electron/i)) {
      return
    }

    paths.push(item.path)
  })

  walker.on('end', resolve.bind(this, paths))
})

const levelCount = location => {
  return location.match(new RegExp('/', 'g') || []).length
}

const sortByLevels = paths => paths.sort((a, b) => {
  return levelCount(b) - levelCount(a)
})

module.exports = async (output, appName) => {
  const toReplace = await getReplacables(output)
  const oldPaths = sortByLevels(toReplace)
  const lowerAppName = appName.toLowerCase()

  for (const oldPath of oldPaths) {
    const details = path.parse(oldPath)

    const newName = details.name.replace(/electron/i, match => {
      const isLowerCase = match === match.toLowerCase()
      return isLowerCase ? lowerAppName : appName
    })

    details.base = details.base.replace(details.name, newName)
    details.name = newName

    const newPath = path.format(details)
    await rename(oldPath, newPath)
  }

  console.log('All renamed')
}
