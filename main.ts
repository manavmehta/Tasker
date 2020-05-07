const electron = require('electron');
const path     = require('path');
const url      = require('url');
const schedule = require('node-schedule');

const {app, BrowserWindow, Menu, ipcMain, dialog} = electron;

let mainWindow, addWindow;

// // Uncomment the following code if the add item still persists when app is Quit
// mainWindow.on('closed', function(){
//   app.quit();
// });
  
  
const CreateAddWindow = () => {
  addWindow = new BrowserWindow({
    width:400,
    height:200,
    title:"Add task"
  });
  
  addWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'addWindow.html'),
    protocol: 'file:',
    slashes:true
  }));
  
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  Menu.setApplicationMenu(mainMenu);
  
  addWindow.on('close', () => {
    addWindow = null;
  });
  
};

ipcMain.on('item:add',(event,item) => {
  
  mainWindow.webContents.send('item:add',item);
  addWindow.close();
  
});

const mainMenuTemplate = [
  {},  
  {
    label:"File",
    submenu:[
      {
        label:'Add Task',
        accelerator:"Ctrl+=",
        click(){
          CreateAddWindow();
        }
      },
      {
        label:'Clear Tasks',
        accelerator:"Ctrl+-",
        click(){
          mainWindow.webContents.send('item:clear');
        }
      },
      {
        label: 'Close', // Need to add a clause for it to only work if on AddWindow Screen
        accelerator: "esc",
        click(){
          addWindow.close();
        }
      },
      {
        label: 'Quit',
        accelerator: process.platform=="darwin" ? "Command+Q" : "Ctrl+Q",
        click(){
          app.quit();
        }
      }
    ]
  }
];

app.on('ready', () => {
  
  mainWindow = new BrowserWindow({});
  
  mainWindow.loadURL(url.format({
    
    pathname: path.join(__dirname, 'mainWindow.html'),
    protocol: 'file:',
    slashes:true

  }));

  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  Menu.setApplicationMenu(mainMenu);

});

// function openShortcuts() {
//   const shortcut = (mainWindow as any).querySelector('.shortcuts');
//   shortcut.addEventListener('click', () => {
//     dialog(`Ctrl + '+' : Add a task
//     Ctrl + '-' : Clear all tasks\
//     Double Click a task to remove it
//     Escape key : Close Add Item Window
//     Ctrl + 'Q' : Quit the app`)
//   });
// }

// openShortcuts();
