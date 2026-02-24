import React from 'react';
import './MyVideos.css';

const MyVideos = () => {
    return (
        <div className="my-videos-container">
            <div className="my-videos-header">
                <h2>Channel content</h2>
            </div>

            <div className="my-videos-list">
                <div className="empty-state">
                    <p>No videos available yet.</p>
                </div>
            </div>
        </div>
    );
};

export default MyVideos;
