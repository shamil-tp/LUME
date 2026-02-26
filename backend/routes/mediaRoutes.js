const router = require('express').Router();
const { uploadMedia, getAllMedia, getMyMedia } = require('../controller/mediaController');
// const { protect } = require('../middleware/authMiddleware');
const { protect } = require('../middleware/protect');
const upload = require('../middleware/upload');

const multiUpload = upload.fields([
    { name: 'mediaFile', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 }
]);

router.post('/upload', protect, multiUpload, uploadMedia);
router.get('/fetchAllMedia',protect,getAllMedia)
router.get('/fetchMyMedia',protect,getMyMedia)
module.exports = router;