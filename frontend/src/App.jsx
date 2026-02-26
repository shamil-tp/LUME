import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import DiscoverSection from './components/DiscoverSection';
import AddNewVideo from './components/AddNewVideo';
import MyVideos from './components/MyVideos';
import VideoModal from './components/VideoModal';
import Login from './components/Login';

function App() {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  // Default: open on desktop (>768px), closed on mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => window.innerWidth > 768);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState('discover');

  const [currentVideoId, setCurrentVideoId] = useState(null);

  // If not logged in, render the login page exclusively
  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  const renderContent = () => {
    switch (currentView) {
      case 'add':
        return <AddNewVideo />;
      case 'myVideos':
        return <MyVideos />;
      case 'discover':
      default:
        return <DiscoverSection onMovieClick={(videoId) => {setCurrentVideoId(videoId);setIsVideoModalOpen(true)}} />;
    }
  };

  return (
    <div className="app-container">
      <Topbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className="main-body">
        <Sidebar
          isOpen={isSidebarOpen}
          currentView={currentView}
          onNavigate={(view) => setCurrentView(view)}
        />

        <main className={`main-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
          {renderContent()}
        </main>
      </div>

      {/* <VideoModal
        isOpen={isVideoModalOpen}
        videoId={currentVideoId}
        onClose={() => {setCurrentVideoId(null);setIsVideoModalOpen(false)}}
      /> */}
      {isVideoModalOpen && currentVideoId && (
        <VideoModal
          isOpen={isVideoModalOpen}
          videoId={currentVideoId}
          onClose={() => {
              setIsVideoModalOpen(false);
              setCurrentVideoId(null);
          }}
        />
      )}
    </div>
  );
}

export default App;
