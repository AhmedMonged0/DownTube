# YouTube Downloader

موقع بسيط لتحميل فيديوهات اليوتيوب

## 🌐 **العمل على Vercel (الإنتاج):**

المشروع جاهز للعمل على Vercel! 

### **✅ الملفات المطلوبة:**
- `vercel.json` - إعدادات Vercel
- `api/` - API functions
- `client/` - تطبيق React

### **🚀 النشر على Vercel:**
```bash
# تثبيت Vercel CLI
npm i -g vercel

# نشر المشروع
vercel

# أو رفع الكود على GitHub وربطه بـ Vercel
```

### **📱 النقاط النهائية على Vercel:**
- **معلومات الفيديو:** `/api/info?url=<youtube-url>`
- **تحميل الفيديو:** `/api/download?url=<youtube-url>`

### **🔧 استكشاف الأخطاء على Vercel:**

#### **إذا ظهر "فشل في الحصول على معلومات الفيديو":**

1. **تحقق من logs:**
   - اذهب إلى [vercel.com](https://vercel.com)
   - اختر مشروعك
   - اضغط على "Functions" في القائمة
   - اضغط على `api/info` لرؤية logs

2. **تحقق من dependencies:**
   - تأكد من أن `@distube/ytdl-core` مثبت
   - تأكد من أن `api/package.json` موجود

3. **تحقق من إعدادات Vercel:**
   - تأكد من أن `vercel.json` صحيح
   - تأكد من أن `maxDuration` كافٍ (30 ثانية)

4. **اختبار API مباشرة:**
   ```bash
   curl "https://your-domain.vercel.app/api/info?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ"
   ```

---

## 💻 **العمل المحلي (التطوير):**

### إصلاح مشكلة "فشل في الحصول على معلومات الفيديو"

تم تحديث `ytdl-core` من الإصدار القديم `4.11.5` إلى `@distube/ytdl-core` الإصدار `4.16.12` لحل مشكلة عدم القدرة على الحصول على معلومات الفيديو.

#### المشكلة:
- كان `ytdl-core` الإصدار `4.11.5` قديم جداً
- YouTube قام بتحديثات تسببت في عدم توافق مع الإصدار القديم
- كان يظهر خطأ "فشل في الحصول على معلومات الفيديو"

#### الحل:
- تم استبدال `ytdl-core` بـ `@distube/ytdl-core`
- `@distube/ytdl-core` هو fork محدث ومتوافق مع التحديثات الحديثة لـ YouTube
- تم تحديث جميع ملفات API لاستخدام الحزمة الجديدة
- تم إنشاء خادم محلي للتطوير والاختبار

## الملفات المحدثة:
- `package.json` - تحديث التبعيات
- `api/info.js` - تحديث import statement وإضافة logging
- `api/download.js` - تحديث import statement
- `api/package.json` - إنشاء package.json منفصل للـ API
- `vercel.json` - تحديث إعدادات Vercel
- `.vercelignore` - إنشاء ملف لتجاهل الملفات غير المطلوبة
- `server.js` - إنشاء خادم محلي جديد
- `client/src/components/YouTubeDownloader.js` - تحديث URLs
- `README.md` - تحديث الوثائق
- `CHANGELOG.md` - إضافة هذا الملف

## التثبيت والتشغيل:

### 1. تثبيت التبعيات
```bash
npm install
```

### 2. تشغيل الخادم (المنفذ 5000) - للتطوير المحلي فقط
```bash
npm run server
```

### 3. تشغيل العميل (المنفذ 3000)
```bash
npm run client
```

### 4. تشغيل كلاهما معاً - للتطوير المحلي فقط
```bash
npm run dev
```

## النقاط النهائية (API Endpoints):

### معلومات الفيديو
```
GET /api/info?url=<youtube-url>
```

### تحميل الفيديو
```
GET /api/download?url=<youtube-url>
```

## الميزات:
- تحميل فيديوهات YouTube بجودة عالية
- الحصول على معلومات الفيديو (العنوان، المدة، الصورة المصغرة)
- واجهة مستخدم بسيطة وسهلة الاستخدام
- دعم للفيديوهات الطويلة والقصيرة
- خادم محلي للتطوير والاختبار
- **جاهز للعمل على Vercel بدون تعديلات إضافية**
- **logging محسن لاستكشاف الأخطاء**

## المتطلبات:
- Node.js 14+
- npm أو yarn

## استكشاف الأخطاء:

### إذا ظهر خطأ "Unexpected token '<'":
1. تأكد من أن الخادم يعمل على المنفذ 5000 (للتطوير المحلي)
2. تأكد من أن العميل يتصل بالمنفذ الصحيح (للتطوير المحلي)
3. تحقق من وحدة التحكم في المتصفح للأخطاء

### إذا لم يعمل التحميل:
1. تأكد من صحة رابط YouTube
2. تحقق من وحدة التحكم في المتصفح
3. تأكد من أن جميع التبعيات مثبتة

### على Vercel:
- التطبيق يعمل تلقائياً بدون مشاكل
- API functions تعمل كـ serverless functions
- لا تحتاج خادم محلي
- **استخدم logs في Vercel dashboard لاستكشاف الأخطاء**
- **تأكد من أن `api/package.json` موجود**