const ytdl = require('@distube/ytdl-core');

module.exports = async (req, res) => {
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
    res.setHeader('Content-Disposition', `attachment; filename="${videoTitle}.mp4"`);
    res.setHeader('Content-Type', 'video/mp4');
    
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
};
