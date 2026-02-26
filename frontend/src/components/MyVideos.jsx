import { useEffect, useState } from 'react';
import api from '../services/api'
import './MyVideos.css';

const MyVideos = () => {
    let [myMedia,setMymedia] = useState([])
    let [isLoding,setLoading] =useState(true)
    const user = JSON.parse(localStorage.getItem('lume_user')) || null

    
    useEffect(()=>{
        const fetchMyMedia = async()=>{
            let token = localStorage.getItem('lume_token')
            try{
                if(!token){
                    throw new Error('token not found')
                }
                let response = await api.get('/media/fetchMyMedia',{
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                })
                setMymedia(response.data.media)
            }catch(e){
                console.log('my media fetching failed')
                console.log(e.message)
            }finally{
                setLoading(false)
            }
        }
        fetchMyMedia()
    },[])
    if(isLoding){
        return (
        <div className="my-videos-container">
            <div className="my-videos-header">
                <h2>Channel content</h2>
            </div>

            <div className="my-videos-list">
                <div className="empty-state">
                    {/* <p>No videos available yet.</p> */}
                    <p>Loading ...</p>
                </div>
            </div>
        </div>
    );
    }
    if(myMedia.length>0){
        return (
            <section className="yt-video-grid">
                {myMedia.map((video) => (
                    <div key={video._id} className="yt-video-card">
                        <div className="yt-thumbnail-container">
                            <img src={video.thumbnailUrl} alt={video.title} className="yt-thumbnail" />
                            <span className="yt-duration">{video.duration}</span>
                        </div>

                        <div className="yt-video-details">
                            <img src={user.picture} alt={user.name} className="yt-channel-avatar" />

                            <div className="yt-video-info">
                                <h3 className="yt-video-title" title={video.title}>{video.title}</h3>
                                <div className="yt-channel-name">{user.name} • <span className="yt-video-meta">
    {video.views} views • {new Date(video.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })}
</span></div>
                            </div>

                            {/* <button className="yt-more-btn" onClick={(e) => e.stopPropagation()}>
                                <MoreVertical size={20} />
                            </button> */}
                        </div>
                    </div>
                ))}
            </section>
        );
    }else{
        return (
                <div className="my-videos-container">
                <div className="my-videos-header">
                    <h2>Channel content</h2>
                </div>

                <div className="my-videos-list">
                    <div className="empty-state">
                        <p>No videos available yet.</p>
                        {/* <p>Loading ...</p> */}
                    </div>
                </div>
            </div>
        )
    }

    
};

export default MyVideos;
