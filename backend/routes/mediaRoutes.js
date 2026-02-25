const router = require('express').Router();
const { uploadMedia } = require('../controller/mediaController');
// const { protect } = require('../middleware/authMiddleware');
const { protect } = require('../middleware/protect');
const upload = require('../middleware/upload');

const multiUpload = upload.fields([
    { name: 'mediaFile', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 }
]);

// POST request to /api/media/upload
// 1. Verify Token -> 2. Upload to Cloudinary -> 3. Save to MongoDB
router.post('/upload', protect, multiUpload, uploadMedia);
// router.post('/upload', multiUpload, uploadMedia);

module.exports = router;