import React from 'react';
import './AddNewVideo.css';

const AddNewVideo = () => {
    return (
        <div className="add-video-container">
            <div className="add-video-header">
                <h2>Add New Video</h2>
                <p>Upload a new video to your channel.</p>
            </div>

            <div className="add-video-box">
                <div className="upload-placeholder">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="upload-icon">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    <p>Drag and drop video files to upload</p>
                    <button className="yt-btn-primary">Select Files</button>
                </div>
            </div>
        </div>
    );
};

export default AddNewVideo;
