const { Queue } = require('bullmq');
const Redis = require('ioredis'); 

const redisConnection = new Redis({
    host: '127.0.0.1',
    port: 6379,
    maxRetriesPerRequest: null
});

const videoQueue = new Queue('video-transcoding', { 
    connection: redisConnection 
});

module.exports = { videoQueue, redisConnection };