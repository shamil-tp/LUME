require('dotenv').config()

const express = require('express')
const cors = require('cors')
const connectDB = require('./config/db')
const tusServer = require('./services/tusServer')
// const { Login } = require('./controller/authController')
const app = express()

app.use(cors({
    origin:[process.env.FRONTEND_URL,'http://localhost:5173','http://localhost:5174']
}))
app.use(express.urlencoded({extended:true}))
app.use(express.json())

const auth = require('./routes/authRoutes')
app.use('/api',auth)

const media = require('./routes/mediaRoutes')
app.use('/api/media',media)

// INTERCEPT THE TUS UPLOADS
// 1. Handle the initial upload creation request
app.all('/api/uploads', (req, res) => {
    tusServer.handle(req, res);
});

// 2. Handle the incoming chunks for a specific file ID
app.all('/api/uploads/:id', (req, res) => {
    tusServer.handle(req, res);
});

// app.post('/api/login', Login)


const port = process.env.PORT || 3001

app.listen(port,()=>{
    console.log("server running")
    connectDB()
})