const xml2js = require('xml2js');
const fs = require('fs');

const parser = new xml2js.Parser();

const xmlToJson = (data, callback) => {
    return parser.parseString(data,  (err, result) => {
        return callback(err, result);
    });
}

module.exports = xmlToJson;

