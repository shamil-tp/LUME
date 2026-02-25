import React, { useState, useRef } from 'react';
import api from '../services/api';
import './AddNewVideo.css';

const AddNewVideo = () => {
    const [mediaFile, setMediaFile] = useState(null);
    const [thumbnail, setThumbnail] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    
    const [isUploading, setIsUploading] = useState(false);
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
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!mediaFile || !title) {
            setMessage('Title and a media file are required!');
            return;
        }

        setIsUploading(true);
        setMessage('Uploading to LUME... Please do not close this page.');

        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            formData.append('mediaFile', mediaFile);
            if (thumbnail) formData.append('thumbnail', thumbnail);

            const token = localStorage.getItem('lume_token');

            const response = await api.post('/media/upload', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            setMessage(`Success! ${response.data.message}`);
            
            // Reset everything after successful upload
            setMediaFile(null);
            setThumbnail(null);
            setTitle('');
            setDescription('');

        } catch (error) {
            console.error("Upload error:", error);
            setMessage(error.response?.data?.error || 'Failed to upload file.');
        } finally {
            setIsUploading(false);
        }
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

                        <div className="form-group">
                            <label>Title (Required)</label>
                            <input 
                                type="text" 
                                value={title} 
                                onChange={(e) => setTitle(e.target.value)} 
                                required 
                                className="yt-input"
                            />
                        </div>

                        <div className="form-group">
                            <label>Description</label>
                            <textarea 
                                value={description} 
                                onChange={(e) => setDescription(e.target.value)} 
                                rows="4" 
                                className="yt-input"
                            ></textarea>
                        </div>

                        <div className="form-group">
                            <label>Custom Thumbnail (Optional)</label>
                            <input 
                                type="file" 
                                accept="image/*" 
                                onChange={(e) => setThumbnail(e.target.files[0])} 
                                className="yt-file-input"
                            />
                        </div>

                        <button 
                            type="submit" 
                            className="yt-btn-primary submit-btn" 
                            disabled={isUploading}
                        >
                            {isUploading ? 'Uploading to Cloudinary...' : 'Publish Media'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default AddNewVideo;