import kue from 'kue';
import SpotifyWebApi from 'spotify-web-api-node';
import { get } from 'lodash'
import asyncMiddleware from '../utils/asyncMiddleware';
import xmlToJson from '../utils/xmlTojson';
import { CLIENT_ID, CLIENT_SECRET, CALLBACK_URL } from '../../config/envVars';

const router = require('express').Router();

const migrationQueue = process.env.REDISTOGO_URL ?
  kue.createQueue({ redis: process.env.REDISTOGO_URL }) : kue.createQueue();

const spotifyApi = new SpotifyWebApi({
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  redirectUri: CALLBACK_URL,
});

router.get('/', (req, res) => {
  res.send({});
});

router.get('/auth', (req, res) => {
  const scopes = ['playlist-read-private', 'playlist-modify-private'];
  const authorizeURL = spotifyApi.createAuthorizeURL(scopes, process.env.STATE);
  res.redirect(authorizeURL);
});

router.get('/callback', asyncMiddleware(async (req, res) => {
  const data = await spotifyApi.authorizationCodeGrant(req.query.code);

  spotifyApi.setAccessToken(data.body.access_token);
  spotifyApi.setRefreshToken(data.body.refresh_token);
  res.send({ confirmation: 'Success' });
}));

router.post('/kickoff', asyncMiddleware(async (req, res) => {
  const uploadedPlaylist = get(req ,'files.playlist');

  if(!uploadedPlaylist) {
    res.send({ confirmation: 'FAIL' });
  }

  const playlistData = uploadedPlaylist.data.toString('utf8');

  xmlToJson(playlistData, (err, playlistJSON) => {
    if (err) {
      res.send({ confirmation: 'XML Parse failed' });
    }

    migrationQueue.create('playlistMigration', { spotifyApi, playlistJSON })
      .ttl(3600000)
      .removeOnComplete(true)
      .save(() => {
        res.send({ playlistJSON });
      });
  });
}));

module.exports = router;
