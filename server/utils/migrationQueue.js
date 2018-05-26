const kue = require('kue');
const migratePlaylist = require('../services/migratePlaylist');

const migrationQueue = process.env.REDISTOGO_URL ? kue.createQueue({ url: REDISTOGO_URL }) : kue.createQueue();

migrationQueue.process('playlistMigration', (job, done) => {
  migratePlaylist(job.data, (tracks) => {
    done();
  });
});

module.exports = migrationQueue;
