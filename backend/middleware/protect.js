const jwt = require('jsonwebtoken')
const User = require('../model/User')

exports.protect = async(req,res,next)=>{
    let token;
        if(res.headers.authorization && res.headers.authorization.startsWith('Bearer')){
        try{
            token = res.headers.authorization.split(' ')[1]
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            req.user = await User.findById(decoded.user._id)
            if(!req.user){
                console.log("user not found")
                return res.status(400).json({message:"user not found"})
            }
            next()
        }catch(e){
            console.log(e)
            return res.status(500).json({message:'protected api route authentication failed'})
        }
    }
    if(!token){
        console.log('no token found')
        return res.status(400).json({message:"no token found"})
    }
}