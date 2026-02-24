const mongoose = require('mongoose')

const connectDB = async()=>{
    try{
        await mongoose.connect(process.env.DB_URI)
        console.log('DATABASE CONNECTED')
    }catch(e){
        console.log('mongoose connection error please check the config')
        console.log(e)
    }
}

module.exports = connectDB