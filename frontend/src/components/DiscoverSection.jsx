import { useEffect, useState } from 'react';
import api from '../services/api'
import { MoreVertical } from 'lucide-react';
import './DiscoverSection.css';

// Standardized Mock Data for YouTube Style
// let MOCK_DATA = [
//     { id: 1, title: 'Building a Cyberpunk City in Unreal Engine 5', channel: 'Level Design Pro', views: '1.2M views', time: '2 days ago', avatar: 'https://i.pravatar.cc/150?img=11', image: 'https://images.unsplash.com/photo-1518773553398-650c184e0bb3?q=80&w=640&auto=format&fit=crop', duration: '14:20' },
//     { id: 2, title: 'Neon Nights Official Mix 2026', channel: 'Synthwave Central', views: '840K views', time: '1 week ago', avatar: 'https://i.pravatar.cc/150?img=12', image: 'https://images.unsplash.com/photo-1555448248-2571daf6344b?q=80&w=640&auto=format&fit=crop', duration: '1:02:45' },
//     { id: 3, title: 'The Void - Deep Space Exploration Documentary', channel: 'Cosmic Docs', views: '3.4M views', time: '1 month ago', avatar: 'https://i.pravatar.cc/150?img=13', image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=640&auto=format&fit=crop', duration: '45:12' },
//     { id: 4, title: 'Quantum Computing Explained in 5 Minutes', channel: 'Tech Simplified', views: '2.1M views', time: '5 months ago', avatar: 'https://i.pravatar.cc/150?img=14', image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=640&auto=format&fit=crop', duration: '5:18' },
//     { id: 5, title: 'Chasing the Eclipse - 4K Timelapse', channel: 'Nature Lens', views: '500K views', time: '2 weeks ago', avatar: 'https://i.pravatar.cc/150?img=15', image: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=640&auto=format&fit=crop', duration: '3:45' },
//     { id: 6, title: 'History of Synthwave Music', channel: 'Retro Beats', views: '150K views', time: '3 days ago', avatar: 'https://i.pravatar.cc/150?img=16', image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=640&auto=format&fit=crop', duration: '18:30' },
//     { id: 7, title: 'Learn React 19 in 1 Hour', channel: 'Code Mastery', views: '2.5M views', time: '1 year ago', avatar: 'https://i.pravatar.cc/150?img=17', image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=640&auto=format&fit=crop', duration: '1:08:12' },
//     { id: 8, title: '10 Gadgets You Need in 2026', channel: 'Tech Reviewer', views: '890K views', time: '4 days ago', avatar: 'https://i.pravatar.cc/150?img=18', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=640&auto=format&fit=crop', duration: '12:05' },
// ];
// let MOCK_DATA = []

const DiscoverSection = ({ onMovieClick }) => {
    let [media,setMedia] = useState([])
    
    // const fetchMedia = async()=>{
    //     try{
    //         let token = localStorage.getItem("token")
    //         let response = await api.get('/media/fetchAll',{
    //             headers:{
    //                 'Authorization': `Bearer ${token}`,
    //                 'Content-Type': 'multipart/form-data'
    //             }
    //         })
    //     }catch(e){
    //         console.log(e.response)
    //         console.log("error fetching video")
    //     }
    // }
    useEffect(() => {
        const fetchMedia = async()=>{
        try{
            let token = localStorage.getItem("lume_token")
            let response = await api.get('/media/fetchAllMedia',{
                headers:{
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            })
            if((response.data && response.data.media)){
                console.log("no media found")
            }
            setMedia(response.data.media)
            // console.log(response.data.media)
        }catch(e){
            console.log(e.response)
            console.log("error fetching video")
        }
    }
        fetchMedia()
        // return () => {
            
        // };
    }, []);

    return (
        <section className="yt-video-grid">
            {media.map((video) => (
                <div key={video._id} className="yt-video-card" onClick={onMovieClick}>
                    <div className="yt-thumbnail-container">
                        <img src={video.thumbnailUrl} alt={video.title} className="yt-thumbnail" />
                        <span className="yt-duration">{video.duration}</span>
                    </div>

                    <div className="yt-video-details">
                        <img src={video.uploader.profilePicture} alt={video.uploader.name} className="yt-channel-avatar" />

                        <div className="yt-video-info">
                            <h3 className="yt-video-title" title={video.title}>{video.title}</h3>
                            <div className="yt-channel-name">{video.uploader.email}</div>
                            <div className="yt-video-meta">
                                {video.views} • {new Date(video.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                            </div>
                        </div>

                        <button className="yt-more-btn" onClick={(e) => e.stopPropagation()}>
                            <MoreVertical size={20} />
                        </button>
                    </div>
                </div>
            ))}
        </section>
    );
};

export default DiscoverSection;
