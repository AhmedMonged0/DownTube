import React, { useState } from 'react';
import YouTubeDownloader from './components/YouTubeDownloader';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            YouTube Downloader
          </h1>
          <p className="text-xl text-gray-600">
            محمل فيديوهات اليوتيوب البسيط والسريع
          </p>
        </header>
        
        <YouTubeDownloader />
        
        <footer className="text-center mt-16 text-gray-500">
          <p>© 2024 YouTube Downloader - جميع الحقوق محفوظة</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
