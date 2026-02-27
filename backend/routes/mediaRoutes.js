const router = require('express').Router();
const { uploadMedia, getAllMedia, getMyMedia, getMediaInfo, getMedia, incrementViewCount } = require('../controller/mediaController');
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
router.get('/fetchMediaInfo/:mediaId',protect,getMediaInfo)
router.get('/fetchMedia/:mediaId',protect,getMedia)
// Add this to your media routes
// Notice we don't necessarily need the 'protect' middleware here 
// if you want logged-out users to also count as views!
router.patch('/incrementView/:id', incrementViewCount);
module.exports = router;