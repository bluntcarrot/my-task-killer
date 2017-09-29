const {Menu} = require('electron');
const electron = require('electron');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');

const template = [
  {
    role: 'window',
    submenu: [
      {
        label: 'Reload',
        accelerator: 'CmdOrCtrl+R',
        click (item, focusedWindow) {
          if (focusedWindow) focusedWindow.reload()
        }
      },
      {
        label: 'Toggle Developer Tools',
        accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
        click (item, focusedWindow) {
          if (focusedWindow) focusedWindow.webContents.toggleDevTools()
        }
      },
      {
        type: 'separator'
      },
      {
        role: 'togglefullscreen'
      },
      {
        role: 'close'
      }
    ]
  },
  {
    label: 'About',
    submenu: [
      {
        label: 'Website',
        click () { require('electron').shell.openExternal('http://devinahoward.com') }
      }
    ]
  }
]

if( process.platform === 'darwin' ){
  const name = app.getName();
  template.unshift({
    label: name,
    submenu: [
      {
        role: 'about'
      },
      {
        type: 'separator'
      },
      {
        role: 'services',
        submenu: []
      },
      {
        type: 'separator'
      },
      {
        role: 'hide'
      },
      {
        role: 'hideothers'
      },
      {
        role: 'unhide'
      },
      {
        type: 'separator'
      },
      {
        role: 'quit'
      }
    ]
  })
  // Edit menu.
  template[1].submenu.push(
    {
      type: 'separator'
    },
    {
      label: 'Speech',
      submenu: [
        {
          role: 'startspeaking'
        },
        {
          role: 'stopspeaking'
        }
      ]
    }
  )
  // Window menu.
  template[3].submenu = [
    {
      label: 'Close',
      accelerator: 'CmdOrCtrl+W',
      role: 'close'
    },
    {
      label: 'Minimize',
      accelerator: 'CmdOrCtrl+M',
      role: 'minimize'
    },
    {
      type: 'separator'
    },
    {
      label: 'Bring All to Front',
      role: 'front'
    }
  ]
}

const menu = Menu.buildFromTemplate( template );
Menu.setApplicationMenu( menu );

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow(){
    
    // Get the size of the screen area
    const screen = require('electron').screen;
    const display = screen.getPrimaryDisplay();
    const area = display.workArea;
    
    // Create the browser window.
    mainWindow = new BrowserWindow( { width: area.width/2, height: area.height } );

    // and load the index.html of the app.
    mainWindow.loadURL( url.format({
        pathname: path.join( __dirname, 'index.html' ),
        protocol: 'file:',
        slashes: true
    }));


    // Open the DevTools.
    // mainWindow.webContents.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on( 'closed', function(){
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on( 'ready', createWindow );

// Quit when all windows are closed.
app.on( 'window-all-closed', function (){
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if( process.platform !== 'darwin' ){
    app.quit();
  }
});

app.on( 'activate', function (){
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if( mainWindow === null ){
    createWindow();
  }
});
