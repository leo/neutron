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

    if (!name.match(/electron/i) || ext === '.asar') {
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

const rename = async (paths, appName, lowerAppName) => {
  // This ensures we start from the deepest level and
  // then move up the the highest one. In turn, there won't
  // be any conflicts.
  const files = sortByLevels(paths)

  // Each file that's being renamed needs to
  // block the loop. Otherwise multiple renamings
  // happen simultaneously and it doesn't work.
  for (const file of files) {
    const details = path.parse(file)
    const newName = fixName(details.name, appName, lowerAppName)

    details.base = details.base.replace(details.name, newName)
    details.name = newName

    const newPath = path.format(details)
    await fs.rename(file, newPath)
  }
}

const setDetails = async (files, appName, lowerAppName) => {
  const savers = new Set()

  for (const file of files) {
    const content = await fs.readFile(file, 'utf8')
    const parsed = plist.parse(content)

    Object.keys(parsed).forEach((key, index) => {
      parsed[key] = fixName(parsed[key], appName, lowerAppName)
    })

    savers.add(fs.writeFile(file, plist.build(parsed)))
  }

  await Promise.all(savers)
}

module.exports = async (output, appName) => {
  const { meta, toRename } = await getReplacables(output)
  const lowerAppName = appName.toLowerCase()

  // Inject appropiate meta data
  await setDetails(meta, appName, lowerAppName)

  // Set the correct names for all files
  await rename(toRename, appName, lowerAppName)

  console.log('Everything injected')
}
