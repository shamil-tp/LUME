require('dotenv').config()

const express = require('express')
const cors = require('cors')
const connectDB = require('./config/db')
const { Login } = require('./controller/authController')
const app = express()

app.use(cors({
    origin:[process.env.FRONTEND_URL,'http://localhost:5173','http://localhost:5174']
}))
app.use(express.urlencoded({extended:true}))
app.use(express.json())

const auth = require('./routes/authRoutes')
app.use('/api',auth)

const media = require('./routes/mediaRoutes')
app.use('/api',media)

// Ensure /api/login is always handled
app.post('/api/login', Login)


const port = process.env.PORT || 3001

// (async()=>{
//     await connectDB()
//     app.listen(port)
// })()
app.listen(port,()=>{
    console.log("server running")
    connectDB()
})