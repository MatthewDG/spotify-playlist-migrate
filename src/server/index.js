import express from 'express';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import kue from 'kue';
import basicAuth from 'basic-auth';
import api from './routes';
import { BASIC_AUTH_API_USERNAME, BASIC_AUTH_API_PASS } from '../config/envVars';

const auth = (req, res, next) => {
  function unauthorized() {
    res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
    return res.sendStatus(401);
  }

  const user = basicAuth(req);

  if (!user || !user.name || !user.pass) {
    return unauthorized(res);
  }

  if (user.name === BASIC_AUTH_API_USERNAME && user.pass === BASIC_AUTH_API_PASS) {
    return next();
  }
  return unauthorized(res);
};


class App {
  constructor() {
    // Create the server
    this._server = express();
    this._server.use(bodyParser.json());
    this._server.use(bodyParser.urlencoded({ extended: false }));
    this._server.use(fileUpload());
    this._server.use('/queue', auth, kue.app);
    this._server.use('/api', api);
  }

  listen(port) {
    return this.server.listen(port || 8888);
  }

  get server() {
    return this._server;
  }
}

module.exports = App;
