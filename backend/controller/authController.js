const User = require('../model/User')
const jwt = require('jsonwebtoken')
const {OAuth2Client} = require('google-auth-library')

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

exports.Login = async(req,res)=>{
    try{
        let {token} = req.body
        if(!token){
            console.log('no token found')
            return res.status(400).json({
                message:"token not found",
                status:false
            })
        }

        const ticket = await client.verifyIdToken({
            idToken:token,
            audience:process.env.GOOGLE_CLIENT_ID
        })

        const payload = ticket.getPayload()

        const {sub:googleId,email,name,picture} = payload

        let user = await User.findOne({googleId})
        if(!user){
           user = await User.create({
                googleId,
                email,
                name,
                profilePicture:picture
            })
            console.log('NEW USER CREATED FOR LUME ',email)
        }
        const lumeToken = jwt.sign({
            user:user._id
        },process.env.JWT_SECRET,{expiresIn:'7d'})

        return res.status(200).json({ 
            message: "Login successful", 
            token: lumeToken, 
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                picture: user.profilePicture
            }
        });
        
    }catch(e){
        return res.status(500).json({
            message:'internal server error check Login api',
            status:false,
            error:e
        })
    }
}