const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

// 1. Log in to Cloudinary using your .env keys
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Configure the storage engine
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'lume_media', // Cloudinary will create this folder to keep things organized
        resource_type: 'auto', // MAGIC SETTING: Automatically detects if it's a video, audio, or image
        allowed_formats: ['mp4', 'mkv', 'mp3', 'wav', 'jpg', 'png', 'jpeg', 'webp']
    }
});

// 3. Create the Multer middleware
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 100 * 1024 * 1024 } // Limits uploads to 100MB to protect your server
});

module.exports = upload;