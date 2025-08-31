import React, { useState } from 'react';

// تكوين الخادم - يعمل على Vercel بدون تحديد منفذ
const API_BASE_URL = '';

const YouTubeDownloader = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [videoInfo, setVideoInfo] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState('');

  const handleUrlChange = (e) => {
    setUrl(e.target.value);
    setError('');
    setVideoInfo(null);
    setDownloadUrl('');
  };

  const validateYouTubeUrl = (urlStr) => {
    // Accepts youtube.com with any subdomain (www, m, music, etc.) and youtu.be
    const youtubeRegex = /^(https?:\/\/)?((([\w-]+)\.)?youtube\.com|youtu\.be)\/.+/i;
    return youtubeRegex.test(urlStr);
  };

  const getVideoInfo = async () => {
    if (!url.trim()) {
      setError('يرجى إدخال رابط الفيديو');
      return;
    }

    if (!validateYouTubeUrl(url)) {
      setError('رابط يوتيوب غير صحيح');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/info?url=${encodeURIComponent(url)}`);
      
      if (!response.ok) {
        let message = 'فشل في الحصول على معلومات الفيديو';
        try {
          const errorData = await response.json();
          if (errorData) {
            const base = errorData.error || message;
            message = errorData.detail ? `${base}: ${errorData.detail}` : base;
          }
        } catch {}
        throw new Error(message);
      }

      const data = await response.json();
      setVideoInfo(data);
      setDownloadUrl(`${API_BASE_URL}/api/download?url=${encodeURIComponent(url)}`);
    } catch (error) {
      setError(error.message);
      setVideoInfo(null);
      setDownloadUrl('');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (downloadUrl) {
      window.open(downloadUrl, '_blank');
    }
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Main Form Card */}
      <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            تحميل فيديو يوتيوب
          </h2>
          <p className="text-gray-600">
            أدخل رابط الفيديو واضغط على "معلومات الفيديو" للحصول على التفاصيل
          </p>
        </div>

        {/* URL Input */}
        <div className="mb-6">
          <label htmlFor="youtube-url" className="block text-sm font-medium text-gray-700 mb-2">
            رابط الفيديو
          </label>
          <div className="flex gap-3">
            <input
              type="url"
              id="youtube-url"
              value={url}
              onChange={handleUrlChange}
              placeholder="https://www.youtube.com/watch?v=..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
            <button
              onClick={getVideoInfo}
              disabled={loading || !url.trim()}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  جاري التحميل...
                </div>
              ) : (
                'معلومات الفيديو'
              )}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-700">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Video Info */}
        {videoInfo && (
          <div className="mb-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">معلومات الفيديو</h3>
            
            {videoInfo.thumbnail && (
              <div className="mb-4">
                <img 
                  src={videoInfo.thumbnail} 
                  alt="Video thumbnail" 
                  className="w-full max-w-sm rounded-lg shadow-md"
                />
              </div>
            )}
            
            <div className="space-y-3">
              <div>
                <span className="font-medium text-gray-700">العنوان:</span>
                <p className="text-gray-800 mt-1">{videoInfo.title}</p>
              </div>
              
              <div className="flex gap-6">
                <div>
                  <span className="font-medium text-gray-700">المؤلف:</span>
                  <p className="text-gray-800">{videoInfo.author}</p>
                </div>
                
                {videoInfo.duration && (
                  <div>
                    <span className="font-medium text-gray-700">المدة:</span>
                    <p className="text-gray-800">{formatDuration(videoInfo.duration)}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Download Button */}
        {downloadUrl && (
          <div className="text-center">
            <button
              onClick={handleDownload}
              className="px-8 py-4 bg-green-600 text-white font-bold text-lg rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-300 focus:ring-offset-2 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              <div className="flex items-center justify-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                تحميل الفيديو
              </div>
            </button>
            <p className="text-sm text-gray-600 mt-3">
              سيبدأ التحميل تلقائياً عند الضغط على الزر
            </p>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
          كيفية الاستخدام
        </h3>
        <div className="space-y-3 text-gray-600">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">1</div>
            <p>انسخ رابط الفيديو من يوتيوب</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">2</div>
            <p>الصق الرابط في الحقل أعلاه</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">3</div>
            <p>اضغط على "معلومات الفيديو" للحصول على التفاصيل</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">4</div>
            <p>اضغط على "تحميل الفيديو" لبدء التحميل</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YouTubeDownloader;
