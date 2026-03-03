require('dotenv').config()

const express = require('express')
const cors = require('cors')
const path = require('path')
const connectDB = require('./config/db')
const tusServer = require('./services/tusServer')
// const { Login } = require('./controller/authController')
const app = express()

app.set('trust proxy', 1);

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
app.get('/', (req, res) => {
    const ua = req.get('User-Agent');
    const ip = req.ip;
    const lang = req.get('Accept-Language');

    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
            <title>Client Details</title>
        </head>
        <body class="bg-light">
            <div class="container mt-5">
                <div class="card shadow-sm mx-auto" style="max-width: 600px;">
                    <div class="card-header bg-primary text-white">
                        <h5 class="mb-0">System Information</h5>
                    </div>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item"><strong>IP Address:</strong> ${ip}</li>
                        <li class="list-group-item"><strong>Language:</strong> ${lang}</li>
                        <li class="list-group-item text-muted" style="font-size: 0.9rem;">
                            <strong>User Agent:</strong><br>${ua}
                        </li>
                    </ul>
                </div>
            </div>
        </body>
        </html>
    `);
});

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
// Add this near your other app.use() statements
app.use('/api/hls', express.static(path.join(__dirname, 'uploads/hls')));
// app.post('/api/login', Login)


const port = process.env.PORT || 3001

app.listen(port,()=>{
    console.log("server running")
    connectDB()
})