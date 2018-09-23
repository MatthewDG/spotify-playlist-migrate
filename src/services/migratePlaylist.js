import SpotifyWebApi from 'spotify-web-api-node';
import { mapSeries, auto } from 'async';

const processTrack = (track, spotifyApi, callback) => {
  auto({
    findTrack: async (cb) => {
      try {
        const data = await spotifyApi.searchTracks(`track:${track.title} artist:${track.artist}`);
        cb(null, data.body);
      } catch (e) {
        cb(e);
      }
    },
  }, (err, results) => callback(null, results));
};

const processPlaylistTracks = (playlistTracksArr, spotifyApi, callback) => mapSeries(playlistTracksArr, (track, next) => processTrack(track, spotifyApi, (err, results) => {
      next(null, results);
    }), (processTracksErr, processTracksResults) => callback(null, processTracksResults));

const migratePlaylist = (params, callback) => {
  const spotifyApi = new SpotifyWebApi();

  spotifyApi._credentials = params.spotifyApi._credentials;
  auto({
    getCurrentUser: async (cb) => {
      try {
        const data = await spotifyApi.getMe();
        cb(null, data.body);
      } catch (e) {
        cb(e);
      }
    },
    processTracks: ['getCurrentUser', (results, cb) => processPlaylistTracks(params.playlistJSON, spotifyApi, (err, res) => cb(null, res))],
  }, (err, migrationResults) => {
    callback(err, migrationResults);
  });
};

module.exports = migratePlaylist;
