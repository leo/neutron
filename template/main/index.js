// Packages
const { app, BrowserWindow } = require('electron')
const { setWindowURL } = require('neutron')

// Create a new example window once the application
// is ready to show something to the user.
app.on('ready', async () => {
  const intro = new BrowserWindow({
    width: 800,
    height: 600
  })

  // This method takes in a `BrowserWindow` instance as the
  // first argument and the name of the renderer page you
  // would like to load as the second one.
  setWindowURL(intro, 'start')
})

// Quit the app once all windows are closed
app.on('window-all-closed', app.quit)
