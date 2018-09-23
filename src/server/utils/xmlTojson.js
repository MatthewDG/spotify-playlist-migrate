import xml2js from 'xml2js';
import { reduce, includes } from 'lodash';

const parser = new xml2js.Parser();

const xmlToJson = (data, callback) => parser.parseString(data, (err, result) => {
  try {
    const trackArray = result.plist.dict[0].dict[0].dict;

    const mappedTrackArray = reduce(trackArray, (list, track) => {
      if (includes(track.key, 'Name') && includes(track.key, 'Artist')) {
        list.push({
          title: track.string[0],
          artist: track.string[1],
        });
        return list;
      }

      return list;
    }, []);
    return callback(null, mappedTrackArray);
  } catch (e) {
    return callback(e, result);
  }
});

module.exports = xmlToJson;
