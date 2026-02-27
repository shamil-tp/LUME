require('dotenv').config()

const express = require('express')
const cors = require('cors')
const connectDB = require('./config/db')
const tusServer = require('./services/tusServer')
// const { Login } = require('./controller/authController')
const app = express()



app.use(cors({
    origin: [process.env.FRONTEND_URL,'http://localhost:5173','http://localhost:5174'],
    methods: ['GET', 'HEAD', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    
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
    // credentials: true
}));

// INTERCEPT THE TUS UPLOADS
app.all('/api/uploads', (req, res) => {
    tusServer.handle(req, res);
});

app.all('/api/uploads/:id', (req, res) => {
    tusServer.handle(req, res);
});
//======
// IMPORTANT PLACE TUS ABOVE BODY PARASER
//=======
app.use(express.urlencoded({extended:true}))
app.use(express.json())

const auth = require('./routes/authRoutes')
app.use('/api',auth)

const media = require('./routes/mediaRoutes')
app.use('/api/media',media)

// Global Error Handler to catch hidden errors like Multer/Cloudinary objects
app.use((err, req, res, next) => {
    console.error("======== GLOBAL ERROR CAUGHT ========");
    console.error("Error Message:", err.message);
    console.error("Error Stack:", err.stack);
    console.error("Error Object Dump:", JSON.stringify(err, null, 2));
    res.status(500).json({ error: err.message, details: err });
});

// app.post('/api/login', Login)


const port = process.env.PORT || 3001

app.listen(port,()=>{
    console.log("server running")
    connectDB()
})