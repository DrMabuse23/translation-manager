import ipc from 'ipc';
import dialog from 'dialog';
import fs from 'fs';
import path from 'path';
import _ from 'lodash';
/**
 * @class OpenFile
 * open a dialog on the finder to get some files from the desk
 */
export default class OpenFile {
  constructor(mainWindow = null) {
    this.mainWindow = mainWindow;
    this.files = [];
    this.filesJson = [];
  }
  getJson(files) {
    let self = this;
    files.forEach((file) => {
      self.filesJson[path.basename(file, '.json')] = require(file);
    });
    //console.log(self.filesJson);
    return self.filesJson;
  }
  getKeys(files) {
    var languages = Object.keys(files);
    var self = this;
    var keys = Object.keys(self.filesJson[languages[0]]);

    languages.forEach((lang, index) => {
      if (index > 0) {
        let diff = _.difference(Object.keys(self.filesJson[lang]), keys);
        console.log(diff, 'diff');
        if (diff.length > 0) {
          diff.forEach((key) => {
            keys.push(key);
          });
        }
      }
    });
    return [keys, languages];
  }
  createRows(files) {
    this.getJson(files);
    var self = this;
    // console.log(this.filesJson, 'files');
    let transKeys = this.getKeys(this.filesJson);
    let rows = [];
    console.log(transKeys[0].length);
    transKeys[0].forEach((key, index) => {
      if (!rows[index]) {
        rows.push([]);
      }
      rows[index].push(key);
      transKeys[1].forEach((lang) => {
        rows[index].push(self.filesJson[lang][key] ? self.filesJson[lang][key] : '');
      });
    });
    console.log(rows, 'rows', rows.length);
    return [transKeys[1], rows];

  }
  /**
   * @test
   */
  test() {
    console.log('test');
    this.mainWindow.webContents.send('ping', 'whoooooooh!');
  }
  /**
   * open a directory
   */
  openFolder() {
    var self = this;
    dialog.showOpenDialog({ properties: ['openDirectory'] }, (resp) => {
      // self.files = resp;
      // let rows = ;
      // console.log(ipc);
      // self.mainWindow.webContents.send('open-folder', self.files);
    });
  }
  /**
   * open a dialog with json filter files
   */
  openFiles() {
    var self = this;
    dialog.showOpenDialog(
      {
        properties: ['openFile', 'multiSelections'],
        filters: [
          { name: 'Json', extensions: ['json'] }
        ]
      },
      (resp) => {
        self.mainWindow.webContents.send('open-files', self.createRows(resp));
      });
  }
  /**
   * @name openFileDialog
   * can be trigger from the renderer and open the file dialog
   */
  openFileDialog() {
    var self = this;
    ipc.on('show-file-dialog', () => {
      self.openFiles();
    });
  }
  /**
   * @name openDirectoryDialog
   * can be trigger from the renderer and openn the dialog
   */
  openDirectoryDialog() {
    var self = this;
    ipc.on('show-directory-dialog', () => {
      self.openFolder();
    });
  }
}