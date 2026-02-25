const Media = require('../model/Media');

exports.uploadMedia = async (req, res) => {
    try {
        if (!req.files || !req.files.mediaFile) {
            return res.status(400).json({ error: "Main media file is missing" });
        }

        const { title, description } = req.body;

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
            uploader: req.user.id
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
        const allMedia = await Media.find()
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
