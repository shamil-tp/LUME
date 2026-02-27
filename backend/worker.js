require('dotenv').config();
const { Worker } = require('bullmq');
const Redis = require('ioredis');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const { uploadDirectoryToR2 } = require('./services/s3uploader');

// Point fluent-ffmpeg to the automatically installed Windows executable
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

// Import your database connection and Media model
const connectDB = require('./config/db');
const Media = require('./model/Media');

// Connect to MongoDB
connectDB();

// Connect to the exact same local Redis server
const redisConnection = new Redis({
    host: '127.0.0.1',
    port: 6379,
    maxRetriesPerRequest: null
});

console.log('👷 FFmpeg Worker started. Waiting for jobs...');

// Create the Worker
const videoWorker = new Worker('video-transcoding', async (job) => {
    const { mediaId, rawVideoPath } = job.data;
    console.log(`\n🎬 Processing Job [${job.id}]: Video ID ${mediaId}`);

    // 1. Create a dedicated folder for this video's streaming chunks
    // Tus saves the raw URL with a massive random ID. We need the physical path.
    // const rawFileId = rawVideoPath.split('/').pop(); 
    // 1. Create a dedicated folder for this video's streaming chunks
    const rawFileId = rawVideoPath.split('/').pop().split('?')[0]; // Clean the ID perfectly
    
    // Tus usually saves without an extension, let's check both!
    const noExtensionPath = path.join(__dirname, 'uploads/raw_videos', rawFileId);
    const binExtensionPath = path.join(__dirname, 'uploads/raw_videos', `${rawFileId}.bin`);
    
    let finalInputPath = noExtensionPath;
    
    // Safety check to find the exact file Tus created
    if (!fs.existsSync(noExtensionPath)) {
        if (fs.existsSync(binExtensionPath)) {
            finalInputPath = binExtensionPath;
        } else {
            throw new Error(`CRITICAL: Cannot find raw video at ${noExtensionPath}`);
        }
    }

    console.log(`📁 Found raw video file at: ${finalInputPath}`);
    
    // Create an output folder specifically for this video
    const outputFolder = path.join(__dirname, 'uploads/hls', mediaId.toString());
    if (!fs.existsSync(outputFolder)) {
        fs.mkdirSync(outputFolder, { recursive: true });
    }

    const outputPath = path.join(outputFolder, 'index.m3u8');

    // 2. Transcode the video using FFmpeg
    return new Promise((resolve, reject) => {
        ffmpeg(finalInputPath)
            .outputOptions([
                // -- HLS STREAMING SETTINGS --
                '-profile:v baseline', // Broad device compatibility
                '-level 3.0',
                '-start_number 0',     // Start chunks at 0
                '-hls_time 10',        // Cut video into 10-second chunks
                '-hls_list_size 0',    // Keep all chunks in the playlist (don't delete old ones)
                '-f hls',              // Format is HTTP Live Streaming
                
                // -- CPU vs GPU --
                // For this first run, we use the standard CPU encoder to ensure it works.
                // Later, we will change this to '-c:v h264_nvenc' to use your RTX 4050!
                '-c:v libx264',
                '-c:a aac',            // Standard web audio format
                '-ar 48000',           // Audio sample rate
                '-b:a 128k',           // Audio bitrate
            ])
            .output(outputPath)
            .on('start', (commandLine) => {
                console.log('🚀 FFmpeg started slicing...');
            })
            .on('progress', (progress) => {
                // You can actually log the transcoding percentage here!
                if (progress.percent) {
                    console.log(`⏱️ Transcoding: ${Math.round(progress.percent)}%`);
                }
            })
            .on('end', async () => {
                console.log('✅ FFmpeg finished successfully! Starting Cloud Upload...');
                
                try {
                    // 1. Upload the entire HLS folder to Cloudflare R2
                    const r2Prefix = `hls/${mediaId}`;
                    await uploadDirectoryToR2(outputFolder, r2Prefix);

                    // 2. Update MongoDB with the new PUBLIC Cloudflare URL
                    // Make sure your R2_PUBLIC_URL in .env does NOT have a slash at the very end
                    const finalStreamingUrl = `${process.env.R2_PUBLIC_URL}/${r2Prefix}/index.m3u8`;
                    
                    await Media.findByIdAndUpdate(mediaId, {
                        status: 'ready',
                        mediaUrl: finalStreamingUrl
                    });
                    
                    console.log(`💾 Database updated. Video ${mediaId} is live on the cloud!`);

                    // 3. CLEANUP: Delete the massive local files off your laptop!
                    fs.rmSync(outputFolder, { recursive: true, force: true });
                    
                    if (fs.existsSync(finalInputPath)) {
                        fs.unlinkSync(finalInputPath); // Deletes the raw Tus file
                    }
                    console.log('🧹 Local hard drive cleaned up.');

                    resolve();
                } catch (cloudError) {
                    console.error('❌ Cloud Upload crashed:', cloudError.message);
                    reject(cloudError);
                }
            })
            .on('error', (err) => {
                console.error('❌ FFmpeg crashed:', err.message);
                reject(err);
            })
            .run();
    });

}, { connection: redisConnection });

videoWorker.on('failed', (job, err) => {
    console.error(`🚨 Job ${job.id} failed with error: ${err.message}`);
});