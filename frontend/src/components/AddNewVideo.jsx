import React, { useState, useRef } from 'react';
import * as tus from 'tus-js-client';
import api from '../services/api';
import './AddNewVideo.css';

const AddNewVideo = () => {
    const [mediaFile, setMediaFile] = useState(null);
    const [thumbnail, setThumbnail] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [duration, setDuration] = useState('00:00');
    
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0); // Track exact percentage
    const [message, setMessage] = useState('');

    const fileInputRef = useRef(null);

    const handleFileSelectClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setMediaFile(file);
            setTitle(file.name.split('.').slice(0, -1).join('.')); 

            // --- THE DURATION EXTRACTION MAGIC ---
            const fileUrl = URL.createObjectURL(file);
            const mediaElement = document.createElement(file.type.startsWith('video/') ? 'video' : 'audio');
            
            mediaElement.onloadedmetadata = () => {
                const rawSeconds = mediaElement.duration;
                const minutes = Math.floor(rawSeconds / 60);
                const seconds = Math.floor(rawSeconds % 60);
                const formattedDuration = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                
                setDuration(formattedDuration); 
                URL.revokeObjectURL(fileUrl);
            };
            
            mediaElement.src = fileUrl;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!mediaFile || !title) {
            setMessage('Title and a media file are required!');
            return;
        }

        setIsUploading(true);
        setUploadProgress(0);
        setMessage('Initializing secure upload...');

        // STEP 1: THE TUS INGESTION
        const upload = new tus.Upload(mediaFile, {
            // Point this to your new Express Tus Server
            endpoint: "http://localhost:5000/api/uploads/", 
            retryDelays: [0, 3000, 5000, 10000, 20000],
            metadata: {
                filename: mediaFile.name,
                filetype: mediaFile.type
            },
            onProgress: (bytesUploaded, bytesTotal) => {
                const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(0);
                setUploadProgress(percentage);
                setMessage(`Ingesting Raw Media: ${percentage}%`);
            },
            onSuccess: async () => {
                // STEP 2: SAVE METADATA TO MONGODB
                setMessage('Ingestion complete! Packaging metadata...');
                
                try {
                    const formData = new FormData();
                    formData.append('title', title);
                    formData.append('description', description);
                    formData.append('duration', duration);
                    // Pass the TUS URL so the backend knows which file to process!
                    formData.append('rawVideoUrl', upload.url); 
                    
                    if (thumbnail) formData.append('thumbnail', thumbnail);

                    const token = localStorage.getItem('lume_token');

                    // Note: Changed endpoint to a 'finalize' route 
                    const response = await api.post('/media/finalize-upload', formData, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data'
                        }
                    });

                    setMessage(`Success! Media queued for processing.`);
                    
                    // Reset everything after successful pipeline entry
                    setMediaFile(null);
                    setThumbnail(null);
                    setTitle('');
                    setDescription('');
                    setUploadProgress(0);

                } catch (error) {
                    console.error("Database saving error:", error);
                    setMessage(error.response?.data?.error || 'Failed to save media details.');
                } finally {
                    setIsUploading(false);
                }
            },
            onError: (error) => {
                console.error("Tus upload error:", error);
                setMessage('Upload failed due to network error.');
                setIsUploading(false);
            }
        });

        // Start the engine
        upload.start();
    };

    return (
        <div className="add-video-container">
            <div className="add-video-header">
                <h2>Add New Media</h2>
                <p>Upload a new video or audio track to LUME.</p>
            </div>

            {message && <div className={`upload-message ${isUploading ? 'loading' : ''}`}>{message}</div>}

            <div className="add-video-box">
                {!mediaFile ? (
                    <div className="upload-placeholder">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="upload-icon">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="17 8 12 3 7 8"></polyline>
                            <line x1="12" y1="3" x2="12" y2="15"></line>
                        </svg>
                        <p>Select video or audio files to upload</p>
                        
                        <input 
                            type="file" 
                            accept="video/*,audio/*" 
                            ref={fileInputRef} 
                            style={{ display: 'none' }} 
                            onChange={handleFileChange}
                        />
                        
                        <button className="yt-btn-primary" onClick={handleFileSelectClick}>
                            Select Files
                        </button>
                    </div>
                ) : (
                    <form className="details-form" onSubmit={handleSubmit}>
                        <div className="selected-file-banner">
                            <span className="file-name">Selected: {mediaFile.name}</span>
                            <button type="button" className="clear-file-btn" onClick={() => setMediaFile(null)}>Change File</button>
                        </div>

                        {/* --- NEW PROGRESS BAR UI --- */}
                        {isUploading && (
                            <div style={{ width: '100%', backgroundColor: 'var(--bg-primary)', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                                <div style={{ width: `${uploadProgress}%`, backgroundColor: '#e50914', height: '100%', transition: 'width 0.2s ease-out' }}></div>
                            </div>
                        )}

                        <div className="form-group">
                            <label>Title (Required)</label>
                            <input 
                                type="text" 
                                value={title} 
                                onChange={(e) => setTitle(e.target.value)} 
                                required 
                                className="yt-input"
                                disabled={isUploading}
                            />
                        </div>

                        <div className="form-group">
                            <label>Description</label>
                            <textarea 
                                value={description} 
                                onChange={(e) => setDescription(e.target.value)} 
                                rows="4" 
                                className="yt-input"
                                disabled={isUploading}
                            ></textarea>
                        </div>

                        <div className="form-group">
                            <label>Custom Thumbnail (Optional)</label>
                            <input 
                                type="file" 
                                accept="image/*" 
                                onChange={(e) => setThumbnail(e.target.files[0])} 
                                className="yt-file-input"
                                disabled={isUploading}
                            />
                        </div>

                        <button 
                            type="submit" 
                            className="yt-btn-primary submit-btn" 
                            disabled={isUploading}
                        >
                            {isUploading ? `Uploading... ${uploadProgress}%` : 'Publish Media'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default AddNewVideo;