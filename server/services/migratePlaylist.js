const SpotifyWebApi = require('spotify-web-api-node');
const { mapSeries, auto } = require('async');

const migratePlaylist = (params, callback) => {
  const spotifyApi = new SpotifyWebApi();

  spotifyApi._credentials = params.spotifyApi._credentials;

  mapSeries(params.playlistJSON, async (track, next) => {
    try {
      const data = await spotifyApi.searchTracks(`track:${track.title} artist:${track.artist}`);
      return data.body;
    } catch (e) {
      return e;
    }
  }, (err, results) => callback(results));
};

module.exports = migratePlaylist;
