require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

class App {
  constructor() {
    this._server = express();
    this._server.use(bodyParser.json());
    this._server.use(bodyParser.urlencoded({ extended: false }));
    this._server.use(fileUpload());
    this._server.use('/api', require('./routes'));
  }
  listen(port) {
    return this.server.listen(port || 8888);
  }
  get server() {
    return this._server;
  }
}

module.exports = App;
