const { Queue } = require('bullmq');
const Redis = require('ioredis'); // Import ioredis

// 1. Create a dedicated, reusable Redis connection
const redisConnection = new Redis({
    host: '127.0.0.1',
    port: 6379,
    maxRetriesPerRequest: null // BullMQ requires this exact setting to be null!
});

// 2. Pass that exact connection to your Queue
const videoQueue = new Queue('video-transcoding', { 
    connection: redisConnection 
});

module.exports = { videoQueue, redisConnection };