const ytdl = require("ytdl-core");

module.exports = async (req, res) => {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({ error: "رابط الفيديو مطلوب" });
    }

    // تحقق من صحة الرابط
    if (!ytdl.validateURL(url)) {
      return res.status(400).json({ error: "رابط يوتيوب غير صحيح" });
    }

    // الحصول على معلومات الفيديو
    const info = await ytdl.getInfo(url);
    const videoDetails = {
      title: info.videoDetails.title,
      duration: `${info.videoDetails.lengthSeconds} ثانية`,
      thumbnail: info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1]?.url,
      author: info.videoDetails.author?.name || "غير معروف"
    };

    return res.status(200).json(videoDetails);

  } catch (error) {
    console.error("❌ خطأ أثناء جلب معلومات الفيديو:", error.message);
    return res.status(500).json({ 
      error: "فشل في الحصول على معلومات الفيديو", 
      details: error.message 
    });
  }
};
