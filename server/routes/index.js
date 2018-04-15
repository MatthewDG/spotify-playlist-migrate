const router = require('express').Router();
const migratePlaylist = require('../services/migratePlaylist');
const asyncMiddleware = require('../utils/asyncMiddleware');
const xmlToJson = require('../utils/xmlToJson');
const migrationQueue = require('../utils/migrationQueue');
const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: process.env.CALLBACK_URL,
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
  const uploadedPlaylist = req.files.playlist;
  const playlistData = uploadedPlaylist.data.toString('utf8');

  xmlToJson(playlistData, (err, playlistJSON) => {
    if (err) {
      res.send({ confirmation: 'XML Parse failed' });
    }

    migrationQueue.create('playlistMigration', { spotifyApi, playlistJSON })
      .removeOnComplete(true)
      .save((err) => {
        res.send({ playlistJSON });
      });
  });
}));

module.exports = router;
