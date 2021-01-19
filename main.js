const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu, ipcMain} = electron;

let mainWindow;

//listen for app to be ready
app.on('ready', function(){
    //Create main Window
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    //Create second Window
    secondWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    // Load html into main window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname,'mainWindow.html'),
        protocol:'file',
        slashes: true
    }));

    // Load html into second window
    secondWindow.loadURL(url.format({
        pathname: path.join(__dirname,'secondWindow.html'),
        protocol:'file',
        slashes: true
    }));

    //quit app when closed
    mainWindow.on('closed', function(){
        app.quit();
    });

    //build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    //insert the menu
    Menu.setApplicationMenu(mainMenu);
});

//Handle create add window
// function createAddWindow(){
//         //Create new Window
//         addWindow = new BrowserWindow({
//             width: 500,
//             height: 500,
//             title: 'View',
//             webPreferences: {
//                 nodeIntegration: true,
//                 contextIsolation: false
//             }
//         });
//         // Load html into window
//         addWindow.loadURL(url.format({
//             pathname: path.join(__dirname,'secondWindow.html'),
//             protocol:'file',
//             slashes: true
//         }));
//         //garbage collection handle
//         addWindow.on('close', function(){
//             addWindow = null;
//         });
// }

//catch item:add
ipcMain.on('item:add',function(e,item){
    console.log(item);
    secondWindow.webContents.send('item:add',item);
    //addWindow.close();
});


//create menu template 
const mainMenuTemplate = [
 {
     label:'File',
     submenu: [
        //  {
        //      label: 'Add Item',
        //     click(){
        //         createAddWindow();
        //     }
        //     },
         {label: 'Clear Items'},
         {
             label: 'Quit',
             accekerator: process.platform =='darwin' ? 'Command+Q' : 'Ctrl+Q',
             click(){
                 app.quit();
             }
        },
         
     ]

 }
];

//add developer tools item if not in prod
if(process.env.NODE_ENV != 'production'){
    mainMenuTemplate.push({
        label: 'Dev Tools',
        submenu: [
            {
                label: 'Toggle Dev Tools',
                click(item,focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            }
        ]
    });
};