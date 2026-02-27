import React, { useEffect, useState } from 'react';
import api from '../services/api';
import LumePlayer from './LumePlayer'; // Import the player we built
import './WatchVideo.css';

const WatchVideo = ({ videoId }) => {
    const [video, setVideo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const handleVideoStart = async () => {
        try {
            await api.patch(`/media/incrementView/${videoId}`);
        } catch (error) {
            console.error("Failed to count view", error);
        }
    };

    useEffect(() => {
        const fetchSingleVideo = async () => {
            try {
                const token = localStorage.getItem('lume_token');
                const response = await api.get(`/media/fetchMedia/${videoId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setVideo(response.data.media);
            } catch (error) {
                console.error("Failed to load video", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSingleVideo();
    }, [videoId]);

    if (isLoading) return <div className="loading-screen">Loading LUME Player...</div>;
    if (!video) return <div className="error-screen">Video not found.</div>;

    return (
        <div className="watch-container">
            <div className="video-player-wrapper">
                {video.mediaType === 'video' ? (
                    /* Swap native video tag for LumePlayer */
                    <LumePlayer 
                        videoUrl={video.mediaUrl} 
                        poster={video.thumbnailUrl}
                        onPlay={handleVideoStart} 
                    />
                ) : (
                    <audio 
                        className="lume-player audio-player" 
                        controls 
                        autoPlay 
                        src={video.mediaUrl}
                    >
                        Your browser does not support the audio element.
                    </audio>
                )}
            </div>

            <div className="video-info-section">
                <h1 className="video-title">{video.title}</h1>
                <div className="video-metadata">
                    <span>{video.views} views</span>
                    <span> • {new Date(video.createdAt).toLocaleDateString()}</span>
                </div>
                
                <div className="video-description-box">
                    <p>{video.description}</p>
                </div>
            </div>
        </div>
    );
};

export default WatchVideo;