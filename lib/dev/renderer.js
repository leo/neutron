// Native
const { createServer } = require('http')
const { join } = require('path')

module.exports = async () => {
  const cwd = process.cwd()
  let next

  try {
    const path = require.resolve('next', {
      paths: [
        join(cwd, 'node_modules')
      ]
    })

    next = require(path)
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') {
      spinner.fail(`Your project is missing the ${'`next`'} dependency`)
    }

    spinner.fail(`Not able to load the ${'`next`'} dependency`)
  }

  const dir = join(cwd, 'renderer')
  const instance = next({ dev: true, dir })
  const requestHandler = instance.getRequestHandler()

  // Build the renderer code and watch the files
  await instance.prepare()

  // But if developing the application, create a
  // new native HTTP server (which supports hot code reloading)
  const server = createServer(requestHandler)
  server.listen(5000)
}
