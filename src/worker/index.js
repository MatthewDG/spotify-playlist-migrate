import kue from 'kue';
import { auto, mapSeries } from 'async';
import migratePlaylist from '../services/migratePlaylist';

const migrationQueue = process.env.NODE_ENV === 'production' ?
kue.createQueue({ redis: process.env.REDISTOGO_URL }) : kue.createQueue();

function requeueActiveJob(jobId, cb){
  kue.Job.get(jobId, (getJobErr, job) => {
    if (getJobErr) return cb(getJobErr);
    job.inactive();
    return cb();
  })
}

auto({
  initialize: cb => {
    // fetch active migrations from Redis queue that need to be resumed
   // move to inactive so that the worker knows to resume them
   migrationQueue.active((getJobsErr, ids) => {
     if (getJobsErr) return cb(getJobsErr);
     return mapSeries(ids, (id, next) => requeueActiveJob(id, next), () => { cb(); });
   });
 },
 defineTasks: ['initialize', (results, cb) => {
   migrationQueue.process('playlistMigration', (job, done) => {
     migratePlaylist(job.data, () => done() );
   });
   return cb();
 }]
})


export default migrationQueue;
