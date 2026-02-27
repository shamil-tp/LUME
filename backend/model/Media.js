const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    
    // --- UPDATED MEDIA FIELDS ---
    // This will initially hold the raw Tus URL, and later be 
    // overwritten by FFmpeg with the final .m3u8 streaming playlist URL
    mediaUrl: {
        type: String,
        required: true 
    },
    // We removed 'required: true' because Cloudinary no longer handles the video!
    mediaPublicId: {
        type: String,
        default: '' 
    },
    
    // --- THUMBNAIL FIELDS (Still using Cloudinary!) ---
    thumbnailUrl: {
        type: String,
        default: '' 
    },
    thumbnailPublicId: {
        type: String,
        default: ''
    },
    
    mediaType: {
        type: String,
        enum: ['video', 'audio'], 
        required: true
    },
    uploader: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    duration: {
        type: String,
        default: '00:00'
    },
    views: {
        type: Number,
        default: 0
    },

    // --- NEW STREAMING PIPELINE FIELDS ---
    // Tracks the FFmpeg background worker status
    status: {
        type: String,
        enum: ['processing', 'ready', 'failed'],
        default: 'processing' // Defaults to processing as soon as Tus finishes
    }

}, { 
    timestamps: true 
});

module.exports = mongoose.model('Media', mediaSchema);

// additonal feilds to add pg rating, cast info, description, directed by , meta data,