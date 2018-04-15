const kue = require('kue');
const migratePlaylist = require('../services/migratePlaylist');

const migrationQueue = kue.createQueue();

migrationQueue.process('playlistMigration', (job, done) => {
  migratePlaylist(job.data, () => {
    done();
  });
});

module.exports = migrationQueue;
