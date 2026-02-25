import React from 'react';
import { Menu, Search, Mic, Upload, Bell, User } from 'lucide-react';
import './Topbar.css';

const Topbar = ({ onToggleSidebar }) => {
    const handleLogout = () => {
        // Simple way to reset state since we don't have a global auth provider yet
        window.location.reload();
    };

    const user = JSON.parse(localStorage.getItem('lume_user'))

    return (
        <header className="yt-topbar">
            <div className="topbar-left">
                <button className="icon-btn menu-btn" onClick={onToggleSidebar}>
                    <Menu size={24} />
                </button>
                <div className="logo-container">
                    <svg height="24" viewBox="0 0 24 24" width="24" fill="red">
                        <path d="M21.582 6.186a2.506 2.506 0 0 0-1.762-1.766C18.265 4 12 4 12 4s-6.264 0-7.82.42a2.506 2.506 0 0 0-1.762 1.766C2 7.74 2 12 2 12s0 4.26.418 5.814a2.506 2.506 0 0 0 1.762 1.766C5.735 20 12 20 12 20s6.265 0 7.82-.42a2.506 2.506 0 0 0 1.762-1.766C22 16.26 22 12 22 12s0-4.26-.418-5.814zM9.993 15.595V8.405l6.362 3.593-6.362 3.597z" />
                    </svg>
                    <span className="logo-text">LUME</span>
                </div>
            </div>

            <div className="topbar-center">
                <div className="search-wrapper">
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Search"
                            className="yt-search-input"
                        />
                    </div>
                    <button className="search-btn">
                        <Search size={20} />
                    </button>
                </div>
                <button className="icon-btn mic-btn">
                    <Mic size={20} />
                </button>
            </div>

            <div className="topbar-right">
                <button className="icon-btn">
                    <Upload size={24} />
                </button>
                <button className="icon-btn">
                    <Bell size={24} />
                </button>
                <div className="yt-profile" onClick={handleLogout} title="Sign Out">
                    {/* <User size={20} /> */}
                    <img src={user.picture} alt="" />
                    {/* <span>{user.name}</span> */}
                </div>
                <div className="yt-name" title="Name">
                    {/* <User size={20} /> */}
                    {/* <img src={user.picture} alt="" /> */}
                    <span>{user.name}</span>
                </div>
            </div>
        </header>
    );
};

export default Topbar;
