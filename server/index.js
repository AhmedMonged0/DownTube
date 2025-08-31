const express = require('express');
const cors = require('cors');
const ytdl = require('@distube/ytdl-core');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'YouTube Downloader API is running!' });
});

// Download endpoint
app.get('/download', async (req, res) => {
  try {
    const { url } = req.query;
    
    if (!url) {
      return res.status(400).json({ error: 'URL parameter is required' });
    }

    // Validate YouTube URL
    if (!ytdl.validateURL(url)) {
      return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    // Get video info
    const info = await ytdl.getInfo(url, {
      requestOptions: {
        headers: {
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0 Safari/537.36',
          'accept-language': 'en-US,en;q=0.9'
        }
      }
    });
    const rawTitle = info.videoDetails.title || 'video';
    const safeTitle = rawTitle.replace(/[\\\/:*?"<>|]/g, '_').slice(0, 100).trim() || 'video';

    // Choose a muxed format (audio+video), prefer MP4
    const formats = info.formats || [];
    const mp4Muxed = formats
      .filter(f => f.hasAudio && f.hasVideo && !f.isHLS && !f.isDashMPD && (
        f.container === 'mp4' || (f.mimeType && f.mimeType.includes('mp4'))
      ))
      .sort((a, b) => (b.height || 0) - (a.height || 0));

    let chosen = mp4Muxed[0];
    if (!chosen) {
      // Try common MP4 itags if available
      chosen = formats.find(f => f.itag === 22) || formats.find(f => f.itag === 18);
    }
    if (!chosen) {
      // Fallback to any muxed format (e.g., webm)
      const anyMuxed = formats
        .filter(f => f.hasAudio && f.hasVideo && !f.isHLS && !f.isDashMPD)
        .sort((a, b) => (b.height || 0) - (a.height || 0));
      chosen = anyMuxed[0];
    }

    if (!chosen) {
      return res.status(500).json({ error: 'Download failed', detail: 'No suitable muxed format found' });
    }

    console.log('Chosen format:', {
      itag: chosen.itag,
      container: chosen.container,
      qualityLabel: chosen.qualityLabel,
      mimeType: chosen.mimeType,
      hasAudio: chosen.hasAudio,
      hasVideo: chosen.hasVideo
    });

    const mime = (chosen.mimeType && chosen.mimeType.split(';')[0]) || (chosen.container === 'webm' ? 'video/webm' : 'video/mp4');
    const ext = mime.includes('webm') ? 'webm' : 'mp4';

    // Set headers for file download
    res.header('Content-Disposition', `attachment; filename="${safeTitle}.${ext}"`);
    res.header('Content-Type', mime);

    // Create download stream for the chosen format
    const stream = ytdl(url, {
      format: chosen,
      requestOptions: {
        headers: {
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0 Safari/537.36',
          'accept-language': 'en-US,en;q=0.9'
        }
      }
    });

    // Pipe the stream to response
    stream.pipe(res);

    // Handle errors
    stream.on('error', (error) => {
      console.error('Stream error:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Download failed', detail: error?.message });
      }
    });
    
  } catch (error) {
    console.error('Download error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Get video info endpoint
app.get('/info', async (req, res) => {
  try {
    const { url } = req.query;
    
    if (!url) {
      return res.status(400).json({ error: 'URL parameter is required' });
    }

    if (!ytdl.validateURL(url)) {
      return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    const info = await ytdl.getInfo(url, {
      requestOptions: {
        headers: {
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0 Safari/537.36',
          'accept-language': 'en-US,en;q=0.9'
        }
      }
    });
    const videoDetails = {
      title: info.videoDetails.title,
      duration: Number(info.videoDetails.lengthSeconds),
      thumbnail: (info.videoDetails.thumbnails && info.videoDetails.thumbnails.length > 0 ? info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1].url : null),
      author: info.videoDetails.author?.name || ''
    };
    
    res.json(videoDetails);
    
  } catch (error) {
    console.error('Info error:', error);
    res.status(500).json({ error: 'Failed to get video info', detail: error?.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📱 Frontend should run on http://localhost:3000`);
  console.log(`🔧 API endpoints:`);
  console.log(`   - GET /download?url=<youtube-url>`);
  console.log(`   - GET /info?url=<youtube-url>`);
});
