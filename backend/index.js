require('dotenv').config()

const express = require('express')
const cors = require('cors')
const connectDB = require('./config/db')
const app = express()

app.use(cors({
    origin:process.env.FRONTEND_URL
}))
app.use(express.urlencoded({extended:true}))
app.use(express.json())

const auth = require('./routes/authRoutes')
app.use('/api',auth)



const port = process.env.PORT || 3001

(async()=>{
    await connectDB()
    app.listen(port)
})()