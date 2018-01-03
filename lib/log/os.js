// Native
const { arch, platform } = require('os')

const names = {
  darwin: 'macOS',
  win32: 'Windows'
}

const arches = {
  x64: '64-bit',
  x32: '32-bit',
  x86: '32-bit'
}

module.exports = `${names[platform()]} on ${arches[arch()]}`
