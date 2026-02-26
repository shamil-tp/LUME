import { useEffect } from 'react';
import api from '../services/api'
import './MyVideos.css';

const MyVideos = () => {
    useEffect(()=>{
        const fetchMyMedia = async()=>{
            let token = localStorage.getItem('token')
            try{
                if(!token){
                    throw new Error('token not found')
                }
                let response = await api.get('/media/fetchMyMedia',{
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                })
            }catch(e){
                console.log('my media fetching failed')
                console.log(e.message)
            }
        }
        fetchMyMedia()
    },[])

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
