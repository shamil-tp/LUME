import { X, Play, Plus, Share2, ThumbsUp } from 'lucide-react';
import api from '../services/api'
import { useState, useEffect } from 'react';
import './VideoModal.css';

const VideoModal = ({ videoId,isOpen, onClose }) => {
    let [media,setMedia] = useState({})
    let [isLoading,setLoading] = useState(true)

    useEffect(()=>{
        if (!isOpen || !videoId) return;
        const fetchMediaInfo = async()=>{
            try{
            let token = localStorage.getItem('lume_token')
            let response = await api.get(`/media/fetchMediaInfo/${videoId}`,{
                headers:{
                    "Authorization": `Bearer ${token}`
                }
            })
            setMedia(response.data.info)
            setLoading(false)
        }catch(e){
            console.log(e.message)
            console.log('error fetching video data')
        }
        }
        fetchMediaInfo()
    },[videoId,isOpen])

    if (!isOpen) return null;

    if(isLoading){
        return (
            <p>Loading .....</p>
        )
    }else{
        return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content glass-panel" onClick={e => e.stopPropagation()}>
                <button className="modal-close glass-panel" onClick={onClose}>
                    <X size={24} />
                </button>

                <div className="modal-hero">
                    <div className="modal-video-placeholder" style={{ backgroundImage: `url(${media.thumbnailUrl})` }}>
                        <button className="main-play-btn">
                            <Play size={32} fill="currentColor" />
                        </button>
                    </div>
                    <div className="modal-hero-gradient"></div>
                </div>

                <div className="modal-details">
                    <div className="modal-info">
                        <div className="modal-tags">
                            <span className="match-score">98% Match</span>
                            <span className="year">2026</span>
                            <span className="age-rating glass-panel">18+</span>
                            <span className="duration">{media.duration}</span>
                            {/* <span className="duration">2h 14m</span> */}
                            <span className="quality glass-panel">4K HDR</span>
                        </div>

                        {/* <h2 className="modal-title">NEON DRIFTER</h2> */}
                        <h2 className="modal-title">{media.title.toUpperCase()}</h2>

                        <div className="modal-actions">
                            <button className="btn-primary">
                                <Play size={20} fill="currentColor" /> Play
                            </button>
                            <button className="btn-icon glass-panel"><Plus size={20} /></button>
                            <button className="btn-icon glass-panel"><ThumbsUp size={20} /></button>
                            <button className="btn-icon glass-panel"><Share2 size={20} /></button>
                        </div>

                        <p className="modal-description">
                            {media.description}
                        </p>
                        {/* <p className="modal-description">
                            In a world where memories can be extracted and sold, a rogue archivist uncovers a conspiracy that threatens the very fabric of human consciousness. The ultimate cyberpunk thriller featuring groundbreaking visual effects.
                        </p> */}
                    </div>

                    <div className="modal-meta">
                        <div className="meta-item">
                            <span className="meta-label">Uploader:</span>
                            <span className="meta-value">{media.uploader.name}</span>
                            {/* <span className="meta-label">Cast:</span>
                            <span className="meta-value">Alina Starkov, Ben Barnes, Jessie Mei Li</span> */}
                        </div>
                        <div className="meta-item">
                            <span className="meta-label">Email:</span>
                            <span className="meta-value">{media.uploader.email}</span>
                            {/* <span className="meta-label">Genres:</span>
                            <span className="meta-value">Sci-Fi, Cyberpunk, Thriller, Action</span> */}
                        </div>
                        <div className="meta-item">
                            <span className="meta-label">Profile:</span>
                            {/* <span className="meta-value">Denis Villeneuve</span> */}
                            <img src={media.uploader.profilePicture} alt={media.uploader.name} className='meta-label' style={{borderRadius:'1 0%',width:"46px"}}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
    }

    
};

export default VideoModal;


// note: bring share ,like add to playlist