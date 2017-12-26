// Native
const path = require('path')

// Packages
const walk = require('klaw')
const fs = require('fs-extra')
const plist = require('plist')

const getReplacables = directory => new Promise((resolve, reject) => {
  const paths = {
    meta: [],
    toRename: []
  }

  const filter = item => path.extname(item) !== '.framework'
  const walker = walk(directory, { filter })

  walker.on('data', item => {
    const { name, ext } = path.parse(item.path)

    if (ext === '.plist') {
      paths.meta.push(item.path)
      return
    }

    if (!name.match(/electron/i)) {
      return
    }

    paths.toRename.push(item.path)
  })

  walker.on('end', resolve.bind(this, paths))
})

const levelCount = location => {
  return location.match(new RegExp('/', 'g') || []).length
}

const sortByLevels = paths => paths.sort((a, b) => {
  return levelCount(b) - levelCount(a)
})

const fixName = (name, appName, lowerAppName) => {
  return String(name).replace(/electron/i, match => {
    const isLowerCase = match === match.toLowerCase()
    return isLowerCase ? lowerAppName : appName
  })
}

const setDetails = async (file, appName, lowerAppName) => {
  const content = await fs.readFile(file, 'utf8')
  const parsed = plist.parse(content)

  Object.keys(parsed).forEach((key, index) => {
    parsed[key] = fixName(parsed[key], appName, lowerAppName)
  })

  await fs.writeFile(file, plist.build(parsed))
}

const rename = async (file, appName, lowerAppName) => {
  const details = path.parse(file)
  const newName = fixName(details.name, appName, lowerAppName)

  details.base = details.base.replace(details.name, newName)
  details.name = newName

  const newPath = path.format(details)
  await fs.rename(file, newPath)
}

module.exports = async (output, appName) => {
  const { meta, toRename } = await getReplacables(output)
  const oldPaths = sortByLevels(toRename)
  const lowerAppName = appName.toLowerCase()

  // Inject appropiate meta data
  for (const file of meta) {
    await setDetails(file, appName, lowerAppName)
  }

  // Set the correct names for all files
  for (const file of oldPaths) {
    await rename(file, appName, lowerAppName)
  }

  console.log('Everything injected')
}
