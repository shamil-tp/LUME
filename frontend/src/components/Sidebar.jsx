import React from 'react';
import { Compass, PlusSquare, PlaySquare } from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ isOpen, currentView, onNavigate }) => {
    const navItems = [
        { id: 'discover', icon: <Compass size={24} />, label: 'Discover' },
        { id: 'add', icon: <PlusSquare size={24} />, label: 'Add' },
        { id: 'myVideos', icon: <PlaySquare size={24} />, label: 'My videos' },
    ];

    return (
        <aside className={`yt-sidebar ${isOpen ? 'open' : 'closed'}`}>
            <div className="sidebar-section">
                {navItems.map((item) => (
                    <div
                        key={item.id}
                        className={`yt-nav-item ${currentView === item.id ? 'active' : ''}`}
                        title={!isOpen ? item.label : ''}
                        onClick={() => onNavigate(item.id)}
                    >
                        <div className="yt-nav-icon">{item.icon}</div>
                        <span className="yt-nav-label">{item.label}</span>
                    </div>
                ))}
            </div>
        </aside>
    );
};

export default Sidebar;
