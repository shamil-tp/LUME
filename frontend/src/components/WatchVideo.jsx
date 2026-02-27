import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom'; // Grabs the video ID from the URL
import api from '../services/api';
import './WatchVideo.css';

const WatchVideo = ({videoId}) => {
    const id = videoId
    // const { id } = useParams(); // Gets the ID from /watch/:id
    const [video, setVideo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const handleVideoStart = async () => {
    try {
        // Send the PATCH request to add +1 to the database
        await api.patch(`/media/incrementView/${videoId}`);
    } catch (error) {
        console.error("Failed to count view", error);
    }
};

    useEffect(() => {
        const fetchSingleVideo = async () => {
            try {
                const token = localStorage.getItem('lume_token')
                // Fetch the specific video data from your Express backend
                const response = await api.get(`/media/fetchMedia/${id}`,{
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                });
                setVideo(response.data.media);
            } catch (error) {
                console.error("Failed to load video", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSingleVideo();
    }, [id]);

    if (isLoading) return <div className="loading-screen">Loading LUME Player...</div>;
    if (!video) return <div className="error-screen">Video not found.</div>;

    return (
        <div className="watch-container">
            <div className="video-player-wrapper">
                {/* THE ACTUAL STREAMING MAGIC HAPPENS HERE */}
                {video.mediaType === 'video' ? (
                    <video 
                        className="lume-player" 
                        controls 
                        autoPlay 
                        src={video.mediaUrl}
                        poster={video.thumbnailUrl} // Shows the thumbnail before it plays
                        onPlay={handleVideoStart}
                    >
                        Your browser does not support the video tag.
                    </video>
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