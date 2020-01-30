const electron = require('electron');
const path = require('path');
const url = require('url');

const {app, BrowserWindow, Menu, ipcMain} = electron;

let mainWindow;

// Listen for app to be ready
app.on('ready', function(){
  // Create new window
  mainWindow = new BrowserWindow({});
  // Load html in window
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'mainWindow.html'),
    protocol: 'file:',
    slashes:true
  }));
  // Build menu from template
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  // Insert menu
  Menu.setApplicationMenu(mainMenu);
});

// // Uncomment the following code if the add item still persists when app is Quit
// mainWindow.on('closed', function(){
//   app.quit();
// });


function CreateAddWindow(){
  addWindow = new BrowserWindow({
    width:400,
    height:200,
    title:"Add task"
  });
  // Load html in window
  addWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'addWindow.html'),
    protocol: 'file:',
    slashes:true
  }));
  // Build menu from template
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  // Insert menu
  Menu.setApplicationMenu(mainMenu);



  addWindow.on('close', function(){
    addWindow = null;
  });

};


ipcMain.on('item:add',function(e,item){
  // console.log(item);
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
              label: 'Close', // Need to add a clause for it should only work if on AddWindow Screen
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

// if (process.platform=="darwin"){
//   mainMenuTemplate.unshift({});
// }

if(process.env.NODE_ENV!=='production'){
  mainMenuTemplate.push(
    {
    label:'Developer Tools',
    submenu:[
      {
        role:'reload'
      },
      {
        label:"Toggle DevTools",
        accelerator: process.platform=="darwin" ? "Command+I" : "Ctrl+I ",
        click(){
          app.quit();
        },
        click(item, focussedWindow){
          focussedWindow.toggleDevTools();
        }
      }
      
    ]
  }
  );
}