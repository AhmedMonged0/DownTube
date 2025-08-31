const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');

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
    const info = await ytdl.getInfo(url);
    const videoTitle = info.videoDetails.title;
    
    // Set headers for file download
    res.header('Content-Disposition', `attachment; filename="${videoTitle}.mp4"`);
    res.header('Content-Type', 'video/mp4');
    
    // Create download stream
    const stream = ytdl(url, {
      format: 'mp4',
      quality: 'highest'
    });
    
    // Pipe the stream to response
    stream.pipe(res);
    
    // Handle errors
    stream.on('error', (error) => {
      console.error('Stream error:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Download failed' });
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

    const info = await ytdl.getInfo(url);
    const videoDetails = {
      title: info.videoDetails.title,
      duration: info.videoDetails.lengthSeconds,
      thumbnail: info.videoDetails.thumbnails[0]?.url,
      author: info.videoDetails.author.name
    };
    
    res.json(videoDetails);
    
  } catch (error) {
    console.error('Info error:', error);
    res.status(500).json({ error: 'Failed to get video info' });
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
