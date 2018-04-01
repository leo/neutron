// Native
const fs = require('fs')
const path = require('path')

// Packages
const octokit = require('@octokit/rest')()
const globby = require('globby')
const mimeTypes = require('mime-types')

// Utilities
const spinner = require('../spinner')

const splitPath = path => {
  const parts = Array.isArray(path) ? path : path.split('/')

  return {
    owner: parts[0],
    repo: parts[1]
  }
}

const getRepository = env => {
  if (env.TRAVIS_REPO_SLUG) {
    return splitPath(env.TRAVIS_REPO_SLUG)
  }

  if (env.CIRCLE_PROJECT_USERNAME) {
    return splitPath([
      env.CIRCLE_PROJECT_USERNAME,
      env.CIRCLE_PROJECT_REPONAME
    ])
  }

  if (env.APPVEYOR_REPO_NAME) {
    return splitPath(env.APPVEYOR_REPO_NAME)
  }
}

const getCommit = env => {
  const commitLock = [
    'CIRCLE_SHA1',
    'TRAVIS_COMMIT',
    'APPVEYOR_REPO_COMMIT'
  ]

  const related = commitLock.find(key => env[key])
  return env[related]
}

module.exports = async (output, config) => {
  const skippingMsg = 'Could not find a valid release, skipping upload'
  const { env } = process

  spinner.create('Checking whether bundle should be uploaded')

  if (!env.GITHUB_TOKEN) {
    spinner.fail(`Please define the "GITHUB_TOKEN" env variable`)
    return
  }

  const commit = getCommit(env)
  const { owner, repo } = getRepository(env)

  octokit.authenticate({
    type: 'token',
    token: env.GITHUB_TOKEN
  })

  let release = null

  try {
    const { data: tags } = await octokit.repos.getTags({ owner, repo })
    const tag = tags.find(tag => tag.commit.sha === commit)
    const { data } = await octokit.repos.getReleases({ owner, repo })

    release = data.find(({ tag_name }) => tag_name === tag.name)

    if (!release) {
      throw new Error('Release does not exist')
    }
  } catch (err) {
    spinner.clear(skippingMsg)
    return
  }

  // It's important that we don't pass the output directory
  // directly here – since we need only the contents
  const files = await globby(`${output}/*`, { nodir: false })
  const uploaders = []
  console.log(files)

  for (const file of files) {
    const name = path.basename(file)
    const contentType = mimeTypes.lookup(name)
    console.log(file)
    console.log(fs.statSync(file))
    const { size: contentLength } = await fs.stat(file)
    const reader = fs.createReadStream(file)

    const uploader = await octokit.repos.uploadAsset({
      url: release.upload_url,
      file: reader,
      contentType,
      contentLength,
      name
    })

    uploaders.push(uploader)
  }

  await Promise.all(uploaders)
  spinner.succeed(`Uploaded bundles to ${tag.name} release`)

  console.log(repo)
  console.log(commit)
  console.log(process.env)
  console.log(output)
  console.log(config)
}
