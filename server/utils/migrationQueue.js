const kue = require('kue');
const migratePlaylist = require('../services/migratePlaylist');

const migrationQueue = process.env.NODE_ENV === 'production' ?
kue.createQueue({ url: process.env.REDISTOGO_URL }) : kue.createQueue();

migrationQueue.process('playlistMigration', (job, done) => {
  migratePlaylist(job.data, (tracks) => {
    done();
  });
});

module.exports = migrationQueue;
