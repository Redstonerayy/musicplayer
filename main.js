/* requirements  */
const { app, BrowserWindow } = require('electron')


/* ==============================================================
                      FUNCTIONS
============================================================== */

function createWindow (w, h, f, htmlfile) {
  let win = new BrowserWindow({
    width: w,
    height: h,
    frame: f,
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.loadFile("index.html");
  //win.openDevTools();
  return win;
}


/* ==============================================================
                      MY APP
============================================================== */

/* launch */

app.on('ready', () => {
    mainwindow = createWindow(1000, 800, true, "index.html");
    // make quit condition
    mainwindow.on('close', () => {
      if(process.platform !== 'darwin'){
        app.quit();
      }
    });
});
