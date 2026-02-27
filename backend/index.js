require('dotenv').config()

const express = require('express')
const cors = require('cors')
const connectDB = require('./config/db')
const tusServer = require('./services/tusServer')
// const { Login } = require('./controller/authController')
const app = express()



// Replace your basic app.use(cors()) with this:
app.use(cors({
    origin: 'http://localhost:5173', // Replace with your exact React port (e.g., 3000 or 5173)
    methods: ['GET', 'HEAD', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    
    // Headers the React client is allowed to SEND to Express
    allowedHeaders: [
        'Authorization', 
        'Content-Type', 
        'Location', 
        'Tus-Extension', 
        'Tus-Max-Size', 
        'Tus-Resumable', 
        'Tus-Version', 
        'Upload-Defer-Length', 
        'Upload-Length', 
        'Upload-Metadata', 
        'Upload-Offset', 
        'X-HTTP-Method-Override', 
        'X-Requested-With'
    ],
    
    // Headers the React client is allowed to READ from Express
    // (Crucial for React to know the final upload.url!)
    exposedHeaders: [
        'Location', 
        'Tus-Extension', 
        'Tus-Max-Size', 
        'Tus-Resumable', 
        'Tus-Version', 
        'Upload-Defer-Length', 
        'Upload-Length', 
        'Upload-Metadata', 
        'Upload-Offset'
    ],
    credentials: true
}));

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