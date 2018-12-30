const electron = require('electron');
const url = require('url');
const path = require('path');
const fs = require('fs');

const {app, BrowserWindow, Menu, dialog, ipcMain} = electron;
const views = path.join(__dirname,'views');

//hoist the mainWindow
let mainWindow;

//ready the app
app.on('ready', () => {
    //create the new windows
    mainWindow = new BrowserWindow({});

    //load the starting html
    mainWindow.loadURL(url.format({
        pathname: path.join(views,'main.html'),
        protocol:'file:',
        slashes:true
    }));

    //load the menue
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

    Menu.setApplicationMenu(mainMenu);
});

function changeView(newView) {
    mainWindow.loadURL(url.format({
        pathname: path.join(views,`${newView}.html`),
        protocol:'file:',
        slashes:true
    }));
}

//Choose which engine to open

function openEngine() {
    var engineObj = {};
    engineObj = dialog.showOpenDialog();

    ipcMain.on('show-open-dialog', (event, args) => {
        const options = {
            title:'Open engine',
            defaultPath: path.join(__dirname,'engines'),
            filters: [
                {
                    extensions: ['.eng']
                }
            ]
        };
        dialog.showOpenDialog(null, options, (filePath) => {
            event.sender.send('open-dialog-paths-selected', filePath)
        })
    });

    if (engineObj == undefined) {
        return;
    } else {
        engineObj = JSON.parse(fs.readFileSync(engineObj[0]));
        return engineObj; 
    }
       
}

function createEngine() {

    //Create an empty engineObj
    var engineObj = {'name':'Untitled','path':'', 'type':'','os':'', 'vulnerabilities':{}};
    return engineObj;
}

function saveEngine(engineObj) {
    if (!Object.keys(engineObj).length) {
        return;
    }

    //otherwise stringify the object and save it
    var json = JSON.stringify(engineObj);
    fs.writeFile(engineObj.path, json, 'utf-8', (err) => { if (err) { throw err}});
}

function generateEngine(engineObj) {

    //This will start injecting the vulnerablilities in the image
    console.log("Generating Engine with params:", engineObj);
}

//Waits for input incase the user does not want to save an engine
ipcMain.on('engine:generate', function(e, engineObj) {
    generateEngine(engineObj);
});

//Waits for the return o fthe engineObj from the page
ipcMain.on('engine:save', function(e, engineObj) {
    console.log('saving configured engine');
    //saveEngine(engineObj);
})

//create the menue

const mainMenuTemplate = [
    {
        label:'File',
        submenu:[
            {
                label:'New Engine',
                accelerator: process.platform == 'darwnin' ? 'Command+N' : 'Ctrl+N',
                click() {
                    //need to create a new engine and save it
                    var engineObj = createEngine();
                    changeView('main');
                    setTimeout(() => {mainWindow.webContents.send('engine:load', engineObj)}, 500);
                    //Send the main.html the newly created engine object that way it can be manipulated, edited, and sent to other pages
                }
            },
            {
                label:'Open Engine',
                accelerator: process.platform == 'darwnin' ? 'Command+O' : 'Ctrl+O',
                click() {
                    var engineObj = openEngine();
                    
                    if (engineObj == undefined) {
                        return;
                    } else {
                        changeView(engineObj.type);
                        setTimeout(() => {mainWindow.webContents.send('engine:load', engineObj)}, 500);
                    }
                    //Need to make this send after openEngine() is finished. Try to use async await                     
                    //parse through the saved engine

                }
            },
            {
                label:'Save Engine',
                accelerator: process.platform == 'darwin' ? 'Command+S' : 'Ctrl+S',
                click(){
                    //Sends the webpage the save command
                    //webpage will send back the engine object based on what is in the webpage
                    mainWindow.webContents.send('engine:save');
                    //if the object does not exist yet (no file has been created or opened) nothing will happen
                }
            },
            {
                label:'Exit',
                accelerator: process.platform == 'darwin' ? 'Commmand+Q' : 'Ctrl+Q',
                click(){
                    app.quit();
                }
            }
        ]
    },
    {
        label:'Mode',
        submenu: [
            {
                label:'Client (WIP)',
                click() {
                    changeView('client');
                }
            },
            {
                label:'Server (WIP)',
                click() {
                    changeView('server');
                }
            },
            {
                label:'Standalone',
                click() {
                   changeView('standalone');
                }
            }
        ]
    }
]

if (process.env.NODE_ENV !== 'production') {
    mainMenuTemplate.push({
        label: 'Dev Tools',
        submenu: [{
            label: 'Toggle DevTools',
            accelerator: process.platform == 'darwin' ? 'Commmand+I' : 'Ctrl+I',
            click(item, focusedWindow) {
                focusedWindow.toggleDevTools();
            }
        }]
    })
}
