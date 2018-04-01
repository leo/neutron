// Packages
const octokit = require('@octokit/rest')()

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

  const { data: tags } = await octokit.repos.getTags({ owner, repo })

  if (!tags || tags.length === 0) {
    spinner.clear(skippingMsg)
    return
  }

  const tag = tags.find(tag => tag.commit.sha === commit)

  if (!tag) {
    spinner.clear(skippingMsg)
    return
  }

  const release = await octokit.repos.getReleaseByTag({
    owner,
    repo,
    tag: tag.name
  })

  if (!release) {
    spinner.clear(skippingMsg)
    return
  }

  console.log(release)

  console.log(repo)
  console.log(commit)
  console.log(process.env)
  console.log(output)
  console.log(config)
}
