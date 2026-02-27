const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');

// Configure the S3 Client for Cloudflare R2
const s3Client = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
});

const uploadDirectoryToR2 = async (localFolderPath, r2FolderPrefix) => {
    const files = fs.readdirSync(localFolderPath);
    
    for (const file of files) {
        const filePath = path.join(localFolderPath, file);
        const fileStream = fs.createReadStream(filePath);
        
        // Critical: Tell the browser exactly what these files are so the video plays
        let contentType = 'application/octet-stream';
        if (file.endsWith('.m3u8')) contentType = 'application/vnd.apple.mpegurl';
        if (file.endsWith('.ts')) contentType = 'video/MP2T';

        const uploadParams = {
            Bucket: process.env.R2_BUCKET_NAME,
            Key: `${r2FolderPrefix}/${file}`, // e.g., hls/69a177.../index.m3u8
            Body: fileStream,
            ContentType: contentType,
        };

        await s3Client.send(new PutObjectCommand(uploadParams));
        console.log(`☁️ Uploaded ${file} to Cloudflare R2`);
    }
};

module.exports = { uploadDirectoryToR2 };