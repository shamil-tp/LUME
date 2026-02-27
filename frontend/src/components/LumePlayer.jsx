import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw } from 'lucide-react';
import './LumePlayer.css';

const LumePlayer = ({ videoUrl, poster, onPlay }) => {
    const videoRef = useRef(null);
    const containerRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [showControls, setShowControls] = useState(true);

    useEffect(() => {
        const video = videoRef.current;
        if (!video || !videoUrl) return;

        let hls;
        if (Hls.isSupported()) {
            hls = new Hls({ capLevelToPlayerSize: true });
            hls.loadSource(videoUrl);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, () => console.log("LUME: Stream Ready"));
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = videoUrl;
        }

        return () => { if (hls) hls.destroy(); };
    }, [videoUrl]);

    // Handlers
    // Inside LumePlayer.jsx
const togglePlay = () => {
    if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
        if (onPlay) onPlay(); // <--- Add this line to trigger the view counter
    } else {
        videoRef.current.pause();
        setIsPlaying(false);
    }
};

    const handleTimeUpdate = () => {
        const currentProgress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
        setProgress(currentProgress);
    };

    const handleSeek = (e) => {
        const time = (e.target.value / 100) * videoRef.current.duration;
        videoRef.current.currentTime = time;
        setProgress(e.target.value);
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    };

    return (
        <div 
            className="lume-container" 
            ref={containerRef}
            onMouseMove={() => setShowControls(true)}
            onMouseLeave={() => isPlaying && setShowControls(false)}
        >
            <video
                ref={videoRef}
                className="lume-video"
                poster={poster}
                onClick={togglePlay}
                onTimeUpdate={handleTimeUpdate}
                playsInline
            />

            <div className={`lume-controls ${showControls ? 'visible' : 'hidden'}`}>
                <div className="lume-progress-container">
                    <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={progress} 
                        onChange={handleSeek}
                        className="lume-progress-bar"
                    />
                </div>

                <div className="lume-buttons">
                    <div className="lume-left">
                        <button onClick={togglePlay}>
                            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                        </button>
                        <button onClick={() => setIsMuted(!isMuted)}>
                            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                        </button>
                    </div>

                    <div className="lume-right">
                        <button onClick={toggleFullscreen}>
                            <Maximize size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LumePlayer;