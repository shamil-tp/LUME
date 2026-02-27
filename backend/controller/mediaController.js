const Media = require('../model/Media');
const { videoQueue } = require('../config/queue');

exports.uploadMedia = async (req, res) => {
    try {
        if (!req.files || !req.files.mediaFile) {
            return res.status(400).json({ error: "Main media file is missing" });
        }

        const { title, description, duration } = req.body;

        const mediaFile = req.files.mediaFile[0];
        const typeOfMedia = mediaFile.mimetype.startsWith('video/') ? 'video' : 'audio';

        let thumbUrl = '';
        let thumbId = '';
        if (req.files.thumbnail) {
            const thumbnailFile = req.files.thumbnail[0];
            thumbUrl = thumbnailFile.path; 
            thumbId = thumbnailFile.filename;   
        }

        const newMedia = new Media({
            title: title,
            description: description,
            mediaUrl: mediaFile.path, 
            mediaPublicId: mediaFile.filename, 
            thumbnailUrl: thumbUrl,
            thumbnailPublicId: thumbId,
            mediaType: typeOfMedia,
            uploader: req.user.id,
            duration: duration || "00:00"
        });

        await newMedia.save();

        res.status(201).json({ 
            message: `${typeOfMedia} uploaded successfully!`, 
            media: newMedia 
        });

    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ error: "Failed to upload media to the database." });
    }
};

exports.getAllMedia = async(req,res)=>{
    try{
        const allMedia = await Media.find().populate('uploader',"email name profilePicture")
        if(!allMedia){
            console.log('fetching media error')
            return res.status(401).json({message:"media fetch not fullfiled"})
        }
        return res.status(201).json({media:allMedia})
    }catch(e){
        console.log(e)
        return res.status(401).json({message:"check controller for all media"})
    }
}

exports.getMyMedia = async(req,res)=>{
    try{
        const myMedia = await Media.find({uploader:req.user._id}).select("-mediaPublicId -thumbnailPublicId -updatedAt -__v -uploader")
        if(!myMedia){
            return res.status(201).json({message:'you have no media',status:false})
        }
        return res.status(201).json({status:true,media:myMedia})
    }catch(e){
        console.log(e)
        return res.status(401).json({message:"check controller for my media"})
    }
}

exports.getMediaInfo = async(req,res)=>{
    try{
        // console.log(req.params.mediaId, "==========")
        if(!req.params.mediaId){
            return null
        }
        const mediaInfo = await Media.findById(req.params.mediaId).populate('uploader','name email profilePicture')
        if(!mediaInfo){
            return res.status(401).json({message:"no media found with given id"})
        }
        return res.status(201).json({info:mediaInfo,message:true})
    }catch(e){
        console.log(e.message)
        return res.status(401).json({message:"check media controller/ getMediaInfo"})
    }
}
exports.getMedia = async(req,res)=>{
    try{
        if(!req.params.mediaId){
            return null
        }
        const media = await Media.findById(req.params.mediaId).populate('uploader','name email profilePicture')
        if(!media){
            return res.status(401).json({message:"no media found with given id"})
        }
        return res.status(201).json({media,message:true})
    }catch(e){
        console.log(e.message)
        return res.status(401).json({message:"check media controller/ getMedia"})
    }
}
// Add this new controller function
exports.incrementViewCount = async (req, res) => {
    try {
        const { id } = req.params;

        // The magic $inc operator you guessed!
        await Media.findByIdAndUpdate(
            id, 
            { $inc: { views: 1 } }, 
            { new: true } // Optional: returns the updated document if you need the new count
        );

        res.status(200).json({ message: "View counted!" });
    } catch (error) {
        console.error("Error updating view count:", error);
        res.status(500).json({ error: "Failed to update views" });
    }
};
// Add this to your mediaController.js
exports.finalizeUpload = async (req, res) => {
    try {
        // 1. Grab the metadata sent from React
        console.log("Incoming Metadata:", req.body);
        const { title, description, duration, rawVideoUrl } = req.body;
        
        // 2. Grab the user ID safely
        const userId = req.user && (req.user._id || req.user.id);
        console.log('finalizeUpload userId:', userId);

        // 3. Handle the thumbnail
        let thumbnailUrl = 'https://via.placeholder.com/1280x720.png?text=Processing...';
        let thumbnailPublicId = '';
        if (req.file) {
            thumbnailUrl = req.file.path; 
            thumbnailPublicId = req.file.filename || '';
        }

        // 4. Create the official LUME database entry
        const newMedia = await Media.create({
            title,
            description,
            duration,
            mediaUrl: rawVideoUrl, 
            mediaPublicId: 'tus-local-file', // Fallback for MongoDB validation
            thumbnailUrl: thumbnailUrl,
            thumbnailPublicId: thumbnailPublicId,
            uploader: userId,
            mediaType: 'video',
            status: 'processing' // Tells the frontend we are working on it
        });

        // ==========================================
        // 5. THE WAKE-UP CALL: Tell Redis to wake up the worker!
        // ==========================================
        await videoQueue.add('transcode-hls', {
            mediaId: newMedia._id,
            rawVideoPath: rawVideoUrl
        });
        
        console.log(`🎟️ Ticket added to queue for video: ${newMedia._id}`);
        // ==========================================

        res.status(201).json({ 
            message: "Upload finalized and queued for processing!", 
            media: newMedia 
        });

    } catch (error) {
        console.error("Finalize upload error name:", error.name);
        console.error("Finalize upload error message:", error.message);
        if (error && error.errors) {
            console.error(
                "Finalize upload validation errors:",
                Object.keys(error.errors).map((key) => ({
                    field: key,
                    message: error.errors[key].message,
                }))
            );
        }
        res.status(500).json({ error: "Failed to save media metadata to database." });
    }
};