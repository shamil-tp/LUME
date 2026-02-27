const { Server } = require('@tus/server');
const { FileStore } = require('@tus/file-store');
const path = require('path');
const fs = require('fs');

// 1. Ensure the raw upload directory exists before starting
const uploadDir = path.join(__dirname, '../uploads/raw_videos');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// 2. Configure the Tus Server
const tusServer = new Server({
    // The base route where React will send the chunks
    path: '/api/uploads', 
    
    // Tell Tus to save the chunks to your local hard drive
    datastore: new FileStore({ directory: uploadDir }),
    
    // 3. THE MAGIC HOOK: What happens when the 100% mark is reached?
    onUploadFinish: async (req, upload) => {
        console.log(`✅ Upload Complete: ${upload.id}`);
        console.log(`📁 File Size: ${upload.size} bytes`);
        
        // FUTURE PHASE 2: 
        // This is exactly where we will tell Redis/BullMQ:
        // "Hey! A new raw video just finished uploading. Start FFmpeg!"
        
        // For now, we just let it finish quietly.
    }
});

module.exports = tusServer;