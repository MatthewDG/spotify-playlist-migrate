const xmlToJson = require('../../server/utils/xmlToJson');
const fs = require('fs');
const path = require('path');
let playlistData;

describe('xmlToJson', () => {
  beforeAll(done => {
    fs.readFile(path.resolve(__dirname, '../fixture/playlist.xml'), (err, data) => {
      playlistData = data.toString('utf8');
      done();
    });
  })
  
  test('converts XML file to JSON', done => {
    xmlToJson(playlistData, (err, playlistJSON) => {
      expect(err).toBe(null);
      expect(playlistJSON).toMatchSnapshot();
      done();
    })
  })
})