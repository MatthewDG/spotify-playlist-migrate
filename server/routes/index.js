const router = require('express').Router();
const asyncMiddleware = require('../utils/asyncMiddleware');
const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
  clientId : process.env.CLIENT_ID,
  clientSecret : process.env.CLIENT_SECRET,
  redirectUri : process.env.CALLBACK_URL
});





router.get('/auth', function(req,res){
  const scopes = ['playlist-read-private', 'playlist-modify-private']
  const authorizeURL = spotifyApi.createAuthorizeURL(scopes, process.env.STATE);
  
  res.redirect(authorizeURL);
});

router.get('/callback', asyncMiddleware(async (req,res) => {
  let data = await spotifyApi.authorizationCodeGrant(req.query.code);

  spotifyApi.setAccessToken(data.body['access_token']);
  spotifyApi.setRefreshToken(data.body['refresh_token']);
  
  res.send({confirmation: 'Success'})
}));

router.post('/kickoff', asyncMiddleware(async (req,res) => {
  let data = await spotifyApi.getUserPlaylists();
  res.json(data);
}));

module.exports = router;