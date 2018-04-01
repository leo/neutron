// Packages
const octokit = require('@octokit/rest')()

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
  const { env } = process

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

  const { data: tags } = await octokit.repos.getTags({owner, repo})

  if (!tags || tags.length === 0) {
    console.log('release does not exist')
    return
  }

  const tag = tags.find(tag =>
    console.log(tag)
    return false
  })

  console.log(tag)

  console.log(repo)
  console.log(commit)
  console.log(process.env)
  console.log(output)
  console.log(config)
}
