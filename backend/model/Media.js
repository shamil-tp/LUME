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
    
    mediaUrl: {
        type: String,
        required: true 
    },
    mediaPublicId: {
        type: String,
        required: true 
    },
    
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
    }
}, { 
    timestamps: true 
});

module.exports = mongoose.model('Media', mediaSchema);

// additonal feilds to add pg rating, cast info, description, directed by , meta data,