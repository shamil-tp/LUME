import React from 'react';
import { X, Play, Plus, Share2, ThumbsUp } from 'lucide-react';
import './VideoModal.css';

const VideoModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content glass-panel" onClick={e => e.stopPropagation()}>
                <button className="modal-close glass-panel" onClick={onClose}>
                    <X size={24} />
                </button>

                <div className="modal-hero">
                    <div className="modal-video-placeholder" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1600&auto=format&fit=crop")' }}>
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
                            <span className="duration">2h 14m</span>
                            <span className="quality glass-panel">4K HDR</span>
                        </div>

                        <h2 className="modal-title">NEON DRIFTER</h2>

                        <div className="modal-actions">
                            <button className="btn-primary">
                                <Play size={20} fill="currentColor" /> Play
                            </button>
                            <button className="btn-icon glass-panel"><Plus size={20} /></button>
                            <button className="btn-icon glass-panel"><ThumbsUp size={20} /></button>
                            <button className="btn-icon glass-panel"><Share2 size={20} /></button>
                        </div>

                        <p className="modal-description">
                            In a world where memories can be extracted and sold, a rogue archivist uncovers a conspiracy that threatens the very fabric of human consciousness. The ultimate cyberpunk thriller featuring groundbreaking visual effects.
                        </p>
                    </div>

                    <div className="modal-meta">
                        <div className="meta-item">
                            <span className="meta-label">Cast:</span>
                            <span className="meta-value">Alina Starkov, Ben Barnes, Jessie Mei Li</span>
                        </div>
                        <div className="meta-item">
                            <span className="meta-label">Genres:</span>
                            <span className="meta-value">Sci-Fi, Cyberpunk, Thriller, Action</span>
                        </div>
                        <div className="meta-item">
                            <span className="meta-label">Director:</span>
                            <span className="meta-value">Denis Villeneuve</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoModal;
