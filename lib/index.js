// Native
const { format } = require('url')

// Packages
const isDev = require('electron-is-dev')
const { resolve } = require('app-root-path')

exports.setWindowURL = (instance, page) => {
  const devPath = `http://localhost:5000/${page}`

  const prodPath = format({
    pathname: resolve(`renderer/out/${page}/index.html`),
    protocol: 'file:',
    slashes: true
  })

  instance.loadURL(isDev ? devPath : prodPath)
}
