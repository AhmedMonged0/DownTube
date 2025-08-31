const ytdl = require("@distube/ytdl-core");

module.exports = async (req, res) => {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({ error: "رابط الفيديو مطلوب" });
    }

    console.log("🔍 محاولة الحصول على معلومات الفيديو:", url);

    // تحقق من صحة الرابط
    if (!ytdl.validateURL(url)) {
      console.log("❌ رابط غير صحيح:", url);
      return res.status(400).json({ error: "رابط يوتيوب غير صحيح" });
    }

    console.log("✅ الرابط صحيح، جاري الحصول على المعلومات...");

    // الحصول على معلومات الفيديو
    const info = await ytdl.getInfo(url);
    console.log("✅ تم الحصول على المعلومات بنجاح");
    
    const videoDetails = {
      title: info.videoDetails.title,
      duration: `${info.videoDetails.lengthSeconds} ثانية`,
      thumbnail: info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1]?.url,
      author: info.videoDetails.author?.name || "غير معروف"
    };

    console.log("📹 معلومات الفيديو:", videoDetails.title);

    return res.status(200).json(videoDetails);

  } catch (error) {
    console.error("❌ خطأ أثناء جلب معلومات الفيديو:", error.message);
    console.error("❌ تفاصيل الخطأ:", error.stack);
    
    // إرسال رسالة خطأ أكثر تفصيلاً
    return res.status(500).json({ 
      error: "فشل في الحصول على معلومات الفيديو", 
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};
