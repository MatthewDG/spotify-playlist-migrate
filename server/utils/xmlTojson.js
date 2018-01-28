const xml2js = require('xml2js');
const { map } = require('lodash');
const fs = require('fs');

const parser = new xml2js.Parser();

const xmlToJson = (data, callback) => {
    return parser.parseString(data,  (err, result) => {
        try {
          let trackArray = result.plist.dict[0].dict[0].dict;
          let mappedTrackArray = map(trackArray, (track) => {
            return {
              title: track.string[0],
              aritst: track.string[1],
            }
          });
          return callback(null, mappedTrackArray);
        }
        catch(e){
          return callback(e, result);
        }
    });
}

module.exports = xmlToJson;

