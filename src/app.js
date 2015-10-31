'use strict';
require('babel/polyfill');

import app from 'app';
import BrowserWindow from 'browser-window';
import crashReporter from 'crash-reporter';

import Menu from 'menu';
import appMenu from './browser/menu/appMenu';

let mainWindow = null;
if(process.env.NODE_ENV === 'develop'){
  crashReporter.start();
  // appMenu.append(devMenu);
}

app.on('window-all-closed', () => {
  app.quit();
});

app.on('ready', () => {

  mainWindow = new BrowserWindow({
    width: 1000,
    height: 600
  });
  Menu.setApplicationMenu(new appMenu(mainWindow).getMenu());
  mainWindow.loadUrl('file://' + __dirname + '/renderer/index.html');
  mainWindow.webContents.on('did-finish-load', function () {
    mainWindow.webContents.send('ping', 'whoooooooh!');
  });
});

