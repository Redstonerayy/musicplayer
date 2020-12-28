/* requirements  */
const { app, BrowserWindow } = require('electron')


/* ==============================================================
                      FUNCTIONS
============================================================== */

function createWindow (w, h, f, d, htmlfile) {
  let win = new BrowserWindow({
    width: w,
    height: h,
    frame: f,
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.loadFile("index.html");
  if(d){
    win.openDevTools();
  }
  return win;
}


/* ==============================================================
                      MY APP
============================================================== */

/* create main window  */


app.on('ready', () => {
    mainwindow = createWindow(1000, 800, true, true, "index.html");
    // make quit condition
    mainwindow.on('close', () => {
      if(process.platform !== 'darwin'){
        app.quit();
      }
    });
});
