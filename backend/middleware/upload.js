require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'lume_thumbnails', // Changed to reflect its new, specific job
        resource_type: 'image',    // Hard-locked to images only for security
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'] // Removed video formats
    }
});

// Create the middleware
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // Dropped the limit from 100MB to 5MB!
});

module.exports = upload;